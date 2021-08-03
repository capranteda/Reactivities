import React, { ChangeEvent } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react';
import { useState } from 'react';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function ActivityForm() {
    const { activityStore } = useStore();
    const { selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState);

    function handleSubmit() {
        activity.id ? updateActivity(activity) : createActivity(activity);
        
    }


    function handelInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target;
        setActivity({
            ...activity,
            [name]: value
        });
    }

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
            <Button onClick={closeForm} floated='right' type='button' content='Cancel' />
        </Form>
    </Segment>
)
})