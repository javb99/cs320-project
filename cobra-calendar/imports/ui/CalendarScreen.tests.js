/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import { toggleMember } from './CalendarScreen.jsx';

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
}
