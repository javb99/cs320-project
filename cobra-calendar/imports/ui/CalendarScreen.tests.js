/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import { toggleMember } from './CalendarScreen.jsx';
import { weekStartForDate } from './CalendarScreen';

if (Meteor.isClient) {
  describe('toggleMember()', function () {
    it('adds the member to an empty list', function () {
      assert.deepEqual(toggleMember([], 'a'), ['a']);
    });
    it('removes the member from a list containing it', function () {
      assert.deepEqual(toggleMember(['a'], 'a'), []);
    });
    it('does not mutate input', function () {
      const startingValue = ['a'];
      const member = 'a';
      toggleMember(startingValue, member);
      assert.deepEqual(startingValue, ['a']);
      assert.equal(member, 'a');
    });
  });
  describe('weekStartForDate()', function () {
    it('returns previous sunday given non-sunday', function () {
      const weekStart = weekStartForDate(new Date(2019, 11, 11));
      assert.equal(weekStart.getDay(), 0);
      assert.equal(weekStart.getDate(), 8);
    });
    it('returns same given sunday', function () {
      const weekStart = weekStartForDate(new Date(2019, 11, 8));
      assert.equal(weekStart.getDay(), 0);
      assert.equal(weekStart.getDate(), 8);
    });
  });
}
