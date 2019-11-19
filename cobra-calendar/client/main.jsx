import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';
import CalendarScreen from '/imports/ui/CalendarScreen';

Meteor.startup(() => {
  render(<CalendarScreen />, document.getElementById('react-target'));
});
