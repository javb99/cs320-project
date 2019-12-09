/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import { militaryTimeForIndex } from './Calendar';
import { parseCalendar } from './icalParser';
import ical from 'ical';

if (Meteor.isServer) {
  describe('parseCalendar()', function () {
    it('returns empty when data is empty', function () {
      const dataPromise = new Promise( resolve => {
        resolve({});
      });
      assert.equal(parseCalendar(dataPromise).length, 0);
    });
  });
}
