import { observer } from 'mobx-react-lite'
import React from 'react'
import { Link } from 'react-router-dom';
import { List, Image, Popup } from 'semantic-ui-react';
import ProfileCard from '../../profiles/ProfileCard';
import { Profile } from './../../../app/models/profile';


interface Props {
    attendees: Profile[];
}

export default observer(function ActivityListItemAttendee({ attendees }: Props) {

    //El css en semantic-ui-react se pasa como un objeto
    const styles = {
        borderColor: 'orange',
        borderWidth: 3
    }

    return (
        <List horizontal>
            {attendees.map((attendee) => (
                <Popup
                    hoverable
                    key={attendee.username}
                    trigger={
                        <List.Item key={attendee.username} as={Link} to={`/profiles/${attendee.username}`}>
                            <Image
                                size="mini"
                                circular
                                src={attendee.image || '/assets/user.png'} 
                            bordered
                            style={attendee.following ? styles : null}
                            />
                        </List.Item>
                    }
                >
                    <Popup.Content>
                        <ProfileCard profile={attendee} />
                    </Popup.Content>
                </Popup>
            ))};

        </List>
    )
})