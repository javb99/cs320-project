import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Meteor } from "meteor/meteor";
import Groups from './groups';

const Events = new Mongo.Collection('events');
export default Events;

// Events.schema = new SimpleSchema({
//   start: Date,
//   end: Date,
//   calendarID: String,
//   ownerID: String
// });

Events.helpers({
  owner() {
    return Meteor.users.find({_id: this.ownerID});
  }
});
