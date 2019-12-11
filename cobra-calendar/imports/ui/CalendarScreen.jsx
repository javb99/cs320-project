import React, { useState } from 'react'

import * as _ from 'underscore';
import { Button, Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'
import Calendar from './Calendar.jsx';
import Calendars from '../api/calendars';
import { Meteor } from 'meteor/meteor';
import { dateAddingDays } from './Calendar';

const CalendarScreen = ({groups, createGroupPressed }) => {
  console.log('groups', groups)

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
  const calendars = Calendars.find({ownerID: userID});
  const events = _.flatten(_.toArray(calendars.map((cal)=>cal.events().fetch())));
  const presentableEvents = _.map(events, (event)=>({color:'red', start: event.start, end: event.end, description:'blocked'}));
  console.log('events from calendars', userID, calendars.fetch(), events, presentableEvents);
  console.log(groups, selectedGroupIndex);
  return (
      <div>
      <Header>Cobra Calendar</Header>
      <Button onClick={importCalendarPressed} />
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
            <Menu.Item
              key='_new_group_'
              name='Create Group'
              onClick={ () => { createGroupPressed() } }
            />

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

function importCalendarPressed() {
  const url = 'https://services.planningcenteronline.com/ical/pnb/PCvcJcItR7pe2x5rHa14QqXgoekWaxZh9508246';// 'https://learn.wsu.edu/webapps/calendar/calendarFeed/c91d0f63cc4a4f06bebe41c4782207b2/learn.ics';
  Meteor.call('addCalendar', 'my cal', url, (error, result) => { console.log('completed add', error, result); });
}

export function weekStartForDate(date) {
  return dateAddingDays(date, -date.getDay());
}
