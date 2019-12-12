import { Meteor } from 'meteor/meteor';
import Groups from '/imports/api/groups';
import Calendars from '../imports/api/calendars';
import Events from '../imports/api/events';
import * as Users from '../imports/api/users';

import icalParser from '/imports/ui/icalParser';
import { Accounts } from 'meteor/accounts-base';

function insertGroup(name, ownerID) {
  Groups.insert({ name: name, ownerID: ownerID, memberIDs: [ownerID], createdAt: new Date() });
}

Meteor.startup(() => {

});

Accounts.onCreateUser((options, user) => {
  console.log('created user', user);
  insertGroup('My Schedule', user._id);
  return user;
});
