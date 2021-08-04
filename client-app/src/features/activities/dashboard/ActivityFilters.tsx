import { Header, Menu } from 'semantic-ui-react'
import { Fragment } from 'react';
import Calendar from 'react-calendar';

export default function ActivityFilters() {

    return (
        <Fragment>
        <Menu vertical size="large" style={{ width: '100%', marginTop:25 }}>
            <Header icon="filter" attached color="teal" content="filters" />
            <Menu.Item content="All activities"/>
            <Menu.Item content="I'm Going"/>
            <Menu.Item content="I'm posting"/>
        </Menu>
        <Header />
        <Calendar/>
        </Fragment>
    )
}