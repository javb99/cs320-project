import React, { useState } from 'react'
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'
import Calendar from '/imports/ui/Calendar';

const CalendarScreen = () => {
  const groupNames = ['WSU CS Juniors', 'PNDLM', 'GridRival'];
  const [selectedIndex, selectIndex] = useState(0)
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
                  active={index == selectedIndex}
                  onClick={ () => selectIndex(index) }
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
            <Menu.Item
                name='Jakob Miner'
                active={true}
                onClick={this.handleItemClick}
            />
            <Menu.Item
                name='Joseph Van Boxtel'
                active={false}
                onClick={this.handleItemClick}
            />
            <Menu.Item
                name='Daniel Brown'
                active={false}
                onClick={this.handleItemClick}
            />
          </Menu>
        </Grid.Column>
      </Grid>
      </div>
  )
}

export default CalendarScreen;
