import React, { useState } from 'react'

import * as _ from 'underscore';
import { Button, Container, Divider, Grid, Header, Menu, Message, Popup, Segment, Table } from 'semantic-ui-react'
import Calendar from './Calendar.jsx';
import Calendars from '../api/calendars';
import { Meteor } from 'meteor/meteor';
import { dateAddingDays } from './Calendar';
import AppMenu from './AppMenu';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';

const CalendarScreen = ({groups, createGroup }) => {

  const [selectedGroupIndex, selectGroupIndex] = useState(0);

  const [selectedMemberIndexes, setSelectedMemberIndexes] = useState(groups.length > 0 ? _.range(groups[selectedGroupIndex].memberIDs.length) : []);
  const now = new Date();
  const [weekStart, setWeekStart] = useState(weekStartForDate(now));

  const prevWeek = () => {
    setWeekStart(dateAddingDays(weekStart, -7));
  };
  const nextWeek = () => {
    setWeekStart(dateAddingDays(weekStart, +7));
  };
  const goToToday = () => {
    setWeekStart(weekStartForDate(now));
  };

  const userID = Meteor.userId();
  const memberIDByGroup = groups[selectedGroupIndex]
      .members()
      .map((member, index) => [member._id, index])
      .filter( (idAndIndex) => (selectedMemberIndexes.includes(idAndIndex[1])))
      .map( (idAndIndex) => idAndIndex[0]);
  const memberIDs = _.uniq(_.flatten(memberIDByGroup));
  console.log('memberIDByGroup', memberIDByGroup, 'memberIDs', memberIDs);
  const calendars = Calendars.find({ownerID: {$in: memberIDs}});
  const events = _.flatten(_.toArray(calendars.map((cal)=>cal.events().fetch())));
  const presentableEvents = _.map(events, (event)=>({color:'white', start: event.start, end: event.end, description:'blocked'}));
  console.log('events from calendars', userID, calendars.fetch(), events, presentableEvents);
  console.log(groups, selectedGroupIndex);
  return (
    <div>
      <AppMenu />
      <Grid>
        <Grid.Column width={2}>
          <Menu fluid vertical pointing>
            {_.pluck(groups, 'name').map( (name, index) => {
              return <Menu.Item
                  key={index}
                  name={name}
                  active={index === selectedGroupIndex}
                  onClick={ () => {
                    selectGroupIndex(index)
                    // Select all members of the new group.
                    setSelectedMemberIndexes(_.range(groups[index].memberIDs.length));
                  } }
              />
            })}
            <Menu.Item key='_new_group_'>
              <Popup on='click' content={
                <CreateGroupForm createGroup={createGroup} />
              } trigger={
                <Button>Create Group</Button>
              }/>
            </Menu.Item>
          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment>
            <Calendar now={now} weekStart={weekStart} events={presentableEvents} prev={prevWeek} next={nextWeek} goToToday={goToToday}/>
          </Segment>
        </Grid.Column>

        <Grid.Column width={2}>
          { groups.length > 0
            ? <Menu fluid vertical>
            {groups[selectedGroupIndex].members().fetch().map( (member, index) =>
              <Menu.Item
                  key={index}
                  name={member.username}
                  active={selectedMemberIndexes.includes(index)}
                  onClick={() => {
                    setSelectedMemberIndexes(toggleMember(selectedMemberIndexes, index))
                  }}
              />
            )}
            <Menu.Item key='_new_invite_'>
              <Popup
                on='click'
                position='left center'
                content={ '/groups/join/' + groups[selectedGroupIndex]._id }
                trigger={
                  <Button>Copy Invite Link</Button>
                }
              />
            </Menu.Item>
          </Menu>
            : 'no groups' }
        </Grid.Column>
      </Grid>
      </div>
  )
}

export default CalendarScreen;

function isNot(testValue) {
  return (v) => {
    return v !== testValue;
  };
}

export function toggleMember(selection, member){
  if(selection.includes(member)) {
    return selection.filter(isNot(member));
  } else {
    return selection.concat([member]);
  }
}

export function weekStartForDate(date) {
  return dateAddingDays(date, -date.getDay());
}

const CreateGroupForm = ({createGroup}) => {
  const handleSubmit = (event) => {
    const data = new FormData(event.target);
    createGroup(data.get('name'), data.get('password'));
  }
  return (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Input
              placeholder='Name'
              name='name'
          />
          <Form.Input
              placeholder='Password'
              name='password'
          />
          <Form.Button content='Submit'/>
        </Form.Group>
      </Form>
  )
};
