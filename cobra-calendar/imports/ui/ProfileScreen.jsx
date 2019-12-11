import React from 'react'
import {
  Button,
  Grid, Popup,
  TableHeaderCell
} from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor';
import Table from 'semantic-ui-react/dist/commonjs/collections/Table';
import TableHeader from 'semantic-ui-react/dist/commonjs/collections/Table/TableHeader';
import TableRow from 'semantic-ui-react/dist/commonjs/collections/Table/TableRow';
import * as Users from '../api/users';
import Calendars from '../api/calendars';
import { useTracker } from 'meteor/react-meteor-data';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';

const ProfileScreen = () => {
  const calendars = useTracker( () => Meteor.user().getCalendars().fetch());
  return (
  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <MyCalendarsList calendars={calendars}/>
    </Grid.Column>
  </Grid>
);
};

export default ProfileScreen;

const MyCalendarsList = ({calendars}) => (
    <Table>
      <TableHeader>
        <TableHeaderCell>
          My Calendars
          <Popup on='click' position='top right' content={
            <URLImportForm importCalendar={(name, url) => Meteor.call('addCalendar', name, url, (error, result) => { console.log('completed add', error, result); })}/>
          } trigger={
            <Button icon="plus" floated='right'/>
          }/>
        </TableHeaderCell>
      </TableHeader>
      {_.map(calendars, (calendar, index) =>
          <TableRow key={index}>
            {calendar.name}
            <Button
                icon="close"
                floated='right'
                onClick={ () => Calendars.remove({_id: calendar._id})}
            />
          </TableRow>
      )}
    </Table>
);
const URLImportForm = ({importCalendar}) => {
  const handleSubmit = (event) => {
    const data = new FormData(event.target);
    importCalendar(data.get('name'), data.get('url'));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Input
            placeholder='Name'
            name='name'
        />
        <Form.Input
            placeholder='ICal URL'
            name='url'
        />
        <Form.Button content='Submit'/>
      </Form.Group>
    </Form>
  )
};
