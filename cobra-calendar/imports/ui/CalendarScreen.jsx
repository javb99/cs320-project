import React, { useState } from 'react'

import * as _ from 'underscore';
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'
import Calendar from './Calendar.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import Groups from '../api/groups';

const CalendarScreen = ({groups, createGroupPressed }) => {
  console.log('groups', groups)

  const [selectedGroupIndex, selectGroupIndex] = useState(0);

  const [selectedMemberIndexes, setSelectedMemberIndexes] = useState(groups.length > 0 ? _.range(groups[selectedGroupIndex].memberIDs.length) : []);

  console.log(groups, selectedGroupIndex);
  return (
      <div>
      <Header>Cobra Calendar</Header>
      <AccountsUIWrapper/>
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
            <Calendar/>
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
            : '' }
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
