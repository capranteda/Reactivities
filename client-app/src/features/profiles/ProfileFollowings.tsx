import React from 'react';
import {Tab, Grid, Header, Card} from "semantic-ui-react";
import ProfileCard from "./ProfileCard";
import {useStore} from "../../app/stores/store";
import { observer } from 'mobx-react-lite';

export default observer(function ProfileFollowings() {
    const {profileStore} = useStore();
    const {profile, followings, loadingFollowings, activeTab} = profileStore;

    return (

        //Es un tab pane que muestra las cards de la gente que sigue o lo sigue
        <Tab.Pane loading={loadingFollowings}>
            <Grid>
                <Grid.Column width='16'>
                    <Header
                        floated='left'
                        icon='user'
                        content={activeTab === 3 ? `People following ${profile!.displayName}` : `People ${profile?.displayName} is following`}
                    />
                </Grid.Column>
                <Grid.Column width='16'>
                    {/* Agregamos la tab con los seguidores/seguidos */}
                    <Card.Group itemsPerRow={4}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})
