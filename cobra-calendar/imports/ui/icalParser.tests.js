/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import { parseCalendar } from './icalParser';

if (Meteor.isServer) {
  describe('parseCalendar()', function () {
    it('returns empty when data is empty', function () {
      assert.equal(parseCalendar({}).length, 0);
    });
    it('parses one event', function () {
      const start = new Date("12/25/2014");
      const end = new Date('12/26/2014');
      const events = {wow:{type: 'VEVENT', start: start, end: end}}
      const result = parseCalendar(events);
      assert.strictEqual(result[0].start.getDay(), start.getDay());
      assert.strictEqual(result[0].end.getDay(), end.getDay());
    });
  });
}
