import React from 'react'
import {
  Button,
  Grid,
  TableHeaderCell
} from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor';
import Table from 'semantic-ui-react/dist/commonjs/collections/Table';
import TableHeader from 'semantic-ui-react/dist/commonjs/collections/Table/TableHeader';
import TableRow from 'semantic-ui-react/dist/commonjs/collections/Table/TableRow';
import * as Users from '../api/users';
import Calendars from '../api/calendars';
import { useTracker } from 'meteor/react-meteor-data';

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
