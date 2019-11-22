/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import { militaryTimeForIndex } from './Calendar';

if (Meteor.isClient) {
  describe('militaryTimeForIndex()', function () {
    it('starts at 800', function () {
      assert.equal(militaryTimeForIndex(0), 800);
    });
    it('is broken into 15 minute slots', function () {
      assert.equal(militaryTimeForIndex(4), 900);
      assert.equal(militaryTimeForIndex(5), 915);
      assert.equal(militaryTimeForIndex(6), 930);
      assert.equal(militaryTimeForIndex(7), 945);
    });
    it('starts ends at 2045', function () {
      assert.equal(militaryTimeForIndex(51), 2045);
    });
  });
}
