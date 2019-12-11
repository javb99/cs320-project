import Events from './events';
import Calendars from './calendars';
import { Meteor } from 'meteor/meteor';

Meteor.users.helpers({
  getCalendars() {
    return Calendars.find({ownerID: this._id});
  }
});
