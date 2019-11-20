import React, { useState } from 'react'
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'
import Calendar from '/imports/ui/Calendar';

const CalendarScreen = () => {
  const groupNames = ['WSU CS Juniors', 'PNDLM', 'GridRival'];
  const memberNames = ['Jakob Miner', 'Joseph Van Boxtel', 'Dan Brown'];

  const [selectedGroupIndex, selectGroupIndex] = useState(0);
  const [selectedMembers, setSelectedMembers] = useState([]);
  return (
      <div>
      <Header>Cobra Calendar</Header>
      <Grid>
        <Grid.Column width={2}>
          <Menu fluid vertical pointing>
            {groupNames.map( (name, index) => {
              return <Menu.Item
                  key={index}
                  name={name}
                  active={index == selectedGroupIndex}
                  onClick={ () => selectGroupIndex(index) }
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
            {memberNames.map( (name, index) => {
              return <Menu.Item
                  key={index}
                  name={name}
                  active={selectedMembers.includes(index)}
                  onClick={ () => { setSelectedMembers(toggleMember(selectedMembers, index)) }}
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

function toggleMember(selection, member){
  if(selection.includes(member)) {
    return selection.filter(isNot(member));
  } else {
    return selection.concat([member]);
  }
}
