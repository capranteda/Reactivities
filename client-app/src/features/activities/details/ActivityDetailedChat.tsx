import { Formik, Form, Field, FieldProps } from 'formik'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Segment, Header, Comment, Loader } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns'

interface Props {
    activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
    const { commentStore } = useStore();

    useEffect(() => {
        if (activityId) {
            commentStore.createHubConnection(activityId);
        }
        return () => {
            commentStore.clearComments();
        }
    }, [commentStore, activityId]);

    return (
        <>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            {/* clearing es para que el float funcione adentro del segmento. todas las flotaciones previas son deshabilitadas */}
            <Segment attached clearing>
                <Formik
                    // en el form usamos el values y resetForm (ambos de formik) para que en el submit llame al metodo addComment del commentStore pasando los values y despues ejecute el metodo resetForm
                    onSubmit={(values, { resetForm }) =>
                        commentStore.addComment(values).then(() => resetForm())}
                    initialValues={{ body: '' }}
                    //validamos el body con Yup
                    validationSchema={Yup.object({
                        body: Yup.string().required()
                    })}
                >
                    {/* tomamos estos atributos y metodos de Formik */}
                    {({ isSubmitting, isValid, handleSubmit }) => (
                        //Ojo que este form no es de semantic-ui-react sino de formik
                        <Form className='ui form'>
                            <Field name='body'>
                                {(props: FieldProps) => (
                                    <div style={{ position: 'relative' }}>
                                        <Loader active={isSubmitting} />
                                        <textarea
                                            placeholder='Enter your comment (Enter to submit, SHIFT + enter for new line)'
                                            rows={2}
                                            // pasamos los onfield, onblur, etc con el ...props
                                            {...props.field}
                                            onKeyPress={e => {
                                                // si toca enter + shift que se ponga una nueva linea
                                                if (e.key === 'Enter' && e.shiftKey) {
                                                    return;
                                                }
                                                // si toca enter y no shift entonces se envian los datos
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    isValid && handleSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </Field>
                        </Form>
                    )}
                </Formik>
                <Comment.Group>
                    {commentStore.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                                    {comment.displayName}
                                </Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistanceToNow(comment.createdAt)} ago</div>
                                </Comment.Metadata>
                                <Comment.Text
                                    /* es un metodo para mostrar mas amigablemente la fecha */
                                    style={{ whiteSpace: 'pre-wrap' }}>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                </Comment.Group>
            </Segment>
        </>

    )
})