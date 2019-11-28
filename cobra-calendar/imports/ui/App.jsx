import React from 'react';
import Groups from '../api/groups.js';
import { useTracker } from 'meteor/react-meteor-data';
import CalendarScreen from './CalendarScreen';
import LogInScreen from './LogInScreen';

const App = () => {
  const groups = useTracker(() => Groups.find({}).fetch(), []);
  console.log('App.groups', groups);
  return (
  <div>
    <LogInScreen/>
    <CalendarScreen groups={groups}/>
  </div>
);};

export default App;
// export default withTracker(() => {
//   return {
//     groups: Groups.find({}).fetch(),
//   };
// })(App);
