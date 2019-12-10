import { Meteor } from 'meteor/meteor';
import Groups from '/imports/api/groups';

import icalParser from '/imports/ui/icalParser';

function insertGroup(name, ownerID) {
  Groups.insert({ name: name, ownerID: ownerID, memberIDs: [ownerID], createdAt: new Date() });
}

Meteor.startup(() => {
  // If the Groups collection is empty, add some data.
  if (Groups.find({}).count() === 0) {

    insertGroup(
      'WSU',
      'aMPrYzdFZ2aC47ELS'
    );

    insertGroup(
      'Clark',
      'aMPrYzdFZ2aC47ELS'
    );

    insertGroup(
      'Crossroads',
      'aMPrYzdFZ2aC47ELS'
    );
  }
});
