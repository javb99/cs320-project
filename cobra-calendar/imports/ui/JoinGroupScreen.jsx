
import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import AppMenu from './AppMenu';
import Groups from '../api/groups';

const JoinGroupScreen = ({match}) => {
  const group = Groups.findOne(match.params._id);
  const joinGroupPressed = (event) => {
    const data = new FormData(event.target);
    joinGroup(data.get('password'), group._id);
  };
  return (
      <div>
        <AppMenu/>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              Join {group.name}?
            </Header>
            <Form size='large' onSubmit={joinGroupPressed}>
              <Segment stacked>
                <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' name='password' type='password'/>
                <Button color='teal' fluid size='large'>Join</Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </div>
  )
};

const joinGroup = (password, groupID) => {
  const validGroup = Groups.findOne({_id: groupID, password: password});
  if (validGroup) {
    Groups.update({_id: groupID},{$addToSet: {memberIDs: Meteor.userId()}});
    console.log('success');
  } else {
    console.log('Not valid password');
  }
};

export default JoinGroupScreen;
