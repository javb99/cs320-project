import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import AccountsUIWrapper from './AccountsUIWrapper';

const SignUpScreen = () => (
  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
        <Image src='/logo.png' /> Sign up for an account
      </Header>
      <Form size='large' onSubmit={signUp}>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='Username' name='username'/>
          <Form.Input fluid icon='lock' iconPosition='left' placeholder='Password' name='password' type='password'/>
          <Form.Input fluid icon='lock' iconPosition='left' placeholder='Repeat Password' name='password-check' type='password'/>
          <Button color='teal' fluid size='large'>Sign Up</Button>
        </Segment>
      </Form>
      <Message>
        Have an account? <a href='/login'>Log In</a>
      </Message>
    </Grid.Column>
  </Grid>
)

const signUp = (event) => {
  const data = new FormData(event.target);
  console.log('Sign Up', data, data.get('username'), data.get('password'));
  createUser(data.get('username'), data.get('password'));
  Meteor.userId()
}

const createUser = (name, password) => {
  Accounts.createUser({username: name, password: password})
}

export default SignUpScreen;
