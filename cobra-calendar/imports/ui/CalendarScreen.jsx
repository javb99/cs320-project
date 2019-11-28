import React, { useState } from 'react'

import * as _ from 'underscore';
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'
import Calendar from './Calendar.jsx';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';

const CalendarScreen = () => {
  const userNames = Meteor.users.find({}).map((user)=>{return user.username})
  console.log('users', userNames, Meteor.users.find({}).fetch())
  const groups = [
    {
      name: 'WSU CS Juniors',
      members: [
          'Jakob Miner',
          'Joseph Van Boxtel',
          'Daniel Brown'
      ]
    }, {
      name: 'PNDLM',
      members: userNames
    }
  ];

  const [selectedGroupIndex, selectGroupIndex] = useState(0);
  const selectedGroup = groups[selectedGroupIndex];

  const [selectedMemberIndexes, setSelectedMemberIndexes] = useState(_.range(selectedGroup.members.length));

  console.log(groups, selectedGroupIndex, selectedGroup);
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
                    setSelectedMemberIndexes(_.range(groups[index].members.length));
                  } }
              />
            })}

          </Menu>
        </Grid.Column>

        <Grid.Column stretched width={12}>
          <Segment>
            <Calendar/>
          </Segment>
        </Grid.Column>

        <Grid.Column width={2}>
          <Menu fluid vertical>
            {groups[selectedGroupIndex].members.map( (name, index) => {

              return <Menu.Item
                  key={index}
                  name={name}
                  active={selectedMemberIndexes.includes(index)}
                  onClick={ () => { setSelectedMemberIndexes(toggleMember(selectedMemberIndexes, index)) }}
              />
            })}
          </Menu>
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
