
import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import AppMenu from './AppMenu';
import Groups from '../api/groups';

const JoinGroupScreen = ({match}) => {
  const group = Groups.findOne(match.params._id);
  return (
      <div>
        <AppMenu/>
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='teal' textAlign='center'>
              Join {group.name}
            </Header>
            <Message>
              New to us?
            </Message>
          </Grid.Column>
        </Grid>
      </div>
  )
};

export default JoinGroupScreen;
