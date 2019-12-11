import React from 'react';
import Groups from '../api/groups.js';
import { useTracker } from 'meteor/react-meteor-data';
import CalendarScreen from './CalendarScreen';
import LogInScreen from './LogInScreen';

const App = () => {
  const groups = useTracker( () => Groups.find({memberIDs: [Meteor.userId()]}).fetch(), [Meteor.userId()] );
  const user = useTracker( () => Meteor.user() );
  console.log('App.groups', groups);
  return (
  <div>
    <CalendarScreen groups={groups} createGroupPressed={ () => createGroup(user.username + "'s friends", user._id) }/>
  </div>
);};

export default App;

const createGroup = (name, ownerID) => {
  console.log('created group: ', name, ownerID)
  Groups.insert({ name, ownerID, memberIDs: [ownerID], createdAt: new Date() });
}
