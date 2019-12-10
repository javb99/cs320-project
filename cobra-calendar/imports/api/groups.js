import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

const Groups = new Mongo.Collection('groups');
export default Groups;

Groups.helpers({
  members() {
    return Meteor.users.find({_id: {$in: this.memberIDs}});
  }
});
