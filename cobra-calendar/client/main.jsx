import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import App from '/imports/ui/App';
import Calendar from '/imports/ui/Calendar';

Meteor.startup(() => {
  render(<Calendar />, document.getElementById('react-target'));
});
