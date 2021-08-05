import React from 'react'
import { Header, Segment, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

export default function NoFound() {
    return (

        <Segment placeholder>
            <Header>
                <Icon name="search" />
                Oops - we've looked everywhere and couldn't find this.
            </Header>
            <Segment.Inline>
                <Button as={Link} to="/activities">
                    Return to activities page
                </Button>
            </Segment.Inline>
        </Segment>


    )}