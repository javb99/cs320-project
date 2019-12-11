import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from "meteor/meteor";
import Events from './events';
import parseICalContentsOf from '../ui/icalParser';

const Calendars = new Mongo.Collection('calendars');
export default Calendars;

// Calendars.schema = new SimpleSchema({
//   name: String,
//   source: {
//     type: String,
//     regEx: SimpleSchema.RegEx.Url
//   },
//   eventIDs: {
//     type: Array
//   }
// });

Calendars.helpers({
  events() {
    return Events.find({_id: {$in: this.eventIDs}});
  }
});

Meteor.methods({
  async addCalendar(name, url) {
    // TODO: validate url
    const events = await parseICalContentsOf(url);
    const newCalID = Calendars.insert({ownerID: Meteor.userId(), name: name, source: url, eventIDs: []});
    const eventIDs = events.map( (event) => {
      return Events.insert({start: event.start, end: event.end, calendarID: newCalID, ownerID: Meteor.userId()})
    });
    // Has to happen in two steps to create the two-way link.
    Calendars.update({_id: newCalID}, {$set: {eventIDs: eventIDs}})
    console.log('added a calendar: ', newCalID, eventIDs);
    return newCalID;
  }
});
