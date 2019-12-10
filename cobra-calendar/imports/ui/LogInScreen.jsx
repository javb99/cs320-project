import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const LogInScreen = () => (
  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
        <Image src='/logo.png' /> Log-in to your account
      </Header>
      <Form size='large' onSubmit={logIn}>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' name='username'/>
          <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' name='password' type='password'/>
          <Button color='teal' fluid size='large'>Login</Button>
        </Segment>
      </Form>
      <Message>
        New to us? <a href='#'>Sign Up</a>
      </Message>
    </Grid.Column>
  </Grid>
)

const logIn = (event) => {
  const data = new FormData(event.target);
  console.log('Log In', data, data.get('username'), data.get('password'));
  createUser(data.get('username'), data.get('password'));
  //Meteor.loginWithPassword(data.get('username'), data.get('password'))
}

const createUser = (name, password) => {
  Accounts.createUser({username: name, password: password})
}

export default LogInScreen;
