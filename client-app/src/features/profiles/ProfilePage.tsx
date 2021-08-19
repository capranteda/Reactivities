import { observer } from 'mobx-react-lite'
import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { useStore } from '../../app/stores/store'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'
import { useEffect } from 'react';
import LoadingComponent from '../../app/layout/LoadingComponent'

export default observer(function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = useStore();
    const { loadingProfile, loadProfile, profile } = profileStore;

    useEffect(() => {
        loadProfile(username);
    }, [loadProfile, username]);

    if (loadingProfile) <LoadingComponent content="Loading profile..." />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <Fragment>
                        <ProfileHeader
                            profile={profile}
                        />
                        <ProfileContent
                            profile={profile}
                        />
                    </Fragment>
                }

            </Grid.Column>

        </Grid>
    )
})