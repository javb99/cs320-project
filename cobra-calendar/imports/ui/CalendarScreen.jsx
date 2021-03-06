import React, { useState } from 'react'

import * as _ from 'underscore';
import { Button, Container, Divider, Grid, Header, Menu, Message, Popup, Segment, Table } from 'semantic-ui-react'
import Calendar from './Calendar.jsx';
import { dateAddingDays } from './Calendar';
import AppMenu from './AppMenu';
import Form from 'semantic-ui-react/dist/commonjs/collections/Form';
import { GroupCalendar, PresentableCalendar } from '../presentation/PresentationCalendars';

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

  const selectedGroupMembers = groups[selectedGroupIndex].members();
  const memberIDs = selectedGroupMembers.map( (member) => member._id );
  const selectedMemberIDs = memberIDs.filter( (id, index) => (selectedMemberIndexes.includes(index)));
  const groupCalendar = new GroupCalendar(selectedMemberIDs);
  const presentableCalendar = new PresentableCalendar(groupCalendar);
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
            <Calendar now={now} weekStart={weekStart} calendar={presentableCalendar} prev={prevWeek} next={nextWeek} goToToday={goToToday}/>
          </Segment>
        </Grid.Column>

        <MembersList
            members={selectedGroupMembers}
            inviteLink={'/groups/join/' + groups[selectedGroupIndex]._id}
            selectedIndexes={selectedMemberIndexes}
            toggleIndex={(index) => {
              setSelectedMemberIndexes(toggleMember(selectedMemberIndexes, index));
            }}
        />
      </Grid>
      </div>
  )
};

export default CalendarScreen;

const MembersList = ({members, selectedIndexes, inviteLink}) => (
  <Grid.Column width={2}>
    <Menu fluid vertical>
      {members.map( (member, index, toggleIndex) =>
          <Menu.Item
              key={index}
              name={member.username}
              active={selectedIndexes.includes(index)}
              onClick={() => { toggleIndex(index); }}
          />
      )}
      <Menu.Item key='_new_invite_'>
        <Popup
            on='click'
            position='left center'
            content={ inviteLink }
            trigger={
              <Button>Copy Invite Link</Button>
            }
        />
      </Menu.Item>
    </Menu>
  </Grid.Column>
);

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
