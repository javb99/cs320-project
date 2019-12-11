import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/startup/accounts-config.js';
import { RenderRoutes } from './routes.js';

Meteor.startup(() => {
  render(<RenderRoutes />, document.getElementById('react-target'));
});
