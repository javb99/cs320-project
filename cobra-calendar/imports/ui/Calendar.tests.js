/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import { militaryTimeForIndex, normalizeEvents, slotsForRawEvents } from './Calendar';
import * as _ from 'underscore';

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
  describe('slotsForRawEvents()', function () {
    it('events starting at 8:00AM go in the first slot', function () {
      const rawEvent = {
        color: 'green',
        start: new Date(2020, 0, 1, 8, 0),
        end: new Date(2020, 0, 1, 8, 15),
        description: 'desc'
      };
      const slots = slotsForRawEvents([rawEvent], 4);
      assert.equal(_.isEqual(slots[800], { start: 800, color: 'green', description: 'desc' }), true);
    });
    it('events starting at 8:45PM go in the last slot', function () {
      const rawEvent = {
        color: 'green',
        start: new Date(2020, 0, 1, 20, 45),
        end: new Date(2020, 0, 1, 21, 0),
        description: 'desc'
      };
      const slots = slotsForRawEvents([rawEvent], 4);
      assert.equal(_.isEqual(slots[2045], { start: 2045, color: 'green', description: 'desc' }), true);
    });
    it('events spanning multiple hours give slots for multiple hours', function () {
      const rawEvent = {
        color: 'green',
        start: new Date(2020, 0, 1, 12, 45),
        end: new Date(2020, 0, 1, 14, 45),
        description: 'desc'
      };
      const slots = slotsForRawEvents([rawEvent], 4);
      assert.equal(_.isEqual(slots[1245], { start: 1245, color: 'green', description: 'desc' }), true);
      assert.equal(_.isEqual(slots[1430], { start: 1430, color: 'green', description: 'desc' }), true);
    });
  });
  describe('normalizeEvents()', function () {
    it('events with times not in increments of 15 minutes extend to 15 minute slots', function () {
      const rawEvent = { color: 'green', start: new Date(2020, 0, 1, 12, 40), end: new Date(2020, 0, 1, 14, 40), description: 'desc' };
      const sut = normalizeEvents([rawEvent], 4);
      console.log(sut);
      assert.equal(sut[0].start, 1230);
      assert.equal(sut[0].end, 1445);
    });
  });
}
