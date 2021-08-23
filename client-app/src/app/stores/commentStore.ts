import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { makeAutoObservable, runInAction } from "mobx";
import { ChatComment } from "../models/comment";
import { store } from "./store";

export default class CommentStore {
    comments: ChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string) => {
        if (store.activityStore.selectedActivity) {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl('http://localhost:5000/chat?activityId=' + activityId, {
                    accessTokenFactory: () => store.userStore.user?.token!
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            this.hubConnection.start().catch(err => console.error('Error establishing the connection: ', err));

            this.hubConnection.on("LoadComments", (comments: ChatComment[]) => {
                runInAction(() =>{
                    //convertimos todas las fechas de string a objetos Date antes de actualizar el estado
                    comments.forEach(comment => {
                        comment.createdAt = new Date(comment.createdAt + 'Z');
                    })
                    this.comments = comments
                });
            })

            //Este metodo lo llamamos desde el sendComment en ChatHub.cs 
            this.hubConnection.on("ReceiveComments", (comment: ChatComment) => {
                runInAction(() => {
                    comment.createdAt = new Date(comment.createdAt);
                    //Usamos unshift para ver los comentarios mas nuevos arriba
                    this.comments.unshift(comment)
                });
            })
        }
    }
    stopHubConnection = () => {
        this.hubConnection?.stop().catch(err => console.error('Error stopping the connection: ', err));
    }

    //Limpiar comentarios cuando nos desconectamos de esa activity
    clearComments = () => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: any) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            //El metodo que queremos invocar es el SedComment en ChatHub.cs
            await this.hubConnection!.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
    }

}
