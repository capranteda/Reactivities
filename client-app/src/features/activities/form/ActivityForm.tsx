import React, { ChangeEvent } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { useHistory, useParams, Link } from 'react-router-dom';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { v4 as uuid } from "uuid";


export default observer(function ActivityForm() {
    const history = useHistory();
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>()
    const [activity, setActivity] = useState({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });


    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!));
    }, [id, loadActivity])

    function handleSubmit() {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid(),
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}}`))
        } else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}}`))
        }

    }


    function handelInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({
            ...activity,
            [name]: value
        });
    }

    if (loadingInitial) return <LoadingComponent content="Loading activity..." />

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input
                    placeholder="Title"
                    name="title"
                    value={activity.title}
                    onChange={handelInputChange}
                />
                <Form.TextArea
                    placeholder="Description"
                    name="description"
                    value={activity.description}
                    onChange={handelInputChange}
                />
                <Form.Input
                    placeholder="Category"
                    name="category"
                    value={activity.category}
                    onChange={handelInputChange} />
                <Form.Input
                    placeholder="Date"
                    name="date"
                    type="date"
                    value={activity.date}
                    onChange={handelInputChange}
                />
                <Form.Input
                    placeholder="City"
                    name="city"
                    value={activity.city}
                    onChange={handelInputChange} />
                <Form.Input
                    placeholder="Venue"
                    name="venue"
                    value={activity.venue}
                    onChange={handelInputChange} />
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
            </Form>
        </Segment>
    )
})