import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from "meteor/meteor";
import Groups from './groups';

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
