/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import assert from 'assert';
import ConcreteTimeSlotFactory from './ConcreteTimeSlotFactory';
import * as _ from 'underscore';

describe('ConcreteTimeSlotFactory', function () {
  describe('militaryTimeFor()', function () {
    it('starts at 800', function () {
      assert.equal(makeSUT().militaryTimeFor(0, 0), 800);
    });
    it('is broken into 15 minute slots', function () {
      const sut = makeSUT();
      assert.equal(sut.militaryTimeFor(1, 0), 900);
      assert.equal(sut.militaryTimeFor(1, 1), 915);
      assert.equal(sut.militaryTimeFor(1, 2), 930);
      assert.equal(sut.militaryTimeFor(1, 3), 945);
    });
    it('starts ends at 2045', function () {
      assert.equal(makeSUT().militaryTimeFor(12, 3), 2045);
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
      const slots = makeSUT().slotsForRawEvents([rawEvent], 4);
      assert.equal(_.isEqual(slots[800], { start: 800, color: 'green', description: 'desc' }), true);
    });
    it('events starting at 8:45PM go in the last slot', function () {
      const rawEvent = {
        color: 'green',
        start: new Date(2020, 0, 1, 20, 45),
        end: new Date(2020, 0, 1, 21, 0),
        description: 'desc'
      };
      const slots = makeSUT().slotsForRawEvents([rawEvent], 4);
      assert.equal(_.isEqual(slots[2045], { start: 2045, color: 'green', description: 'desc' }), true);
    });
    it('events spanning multiple hours give slots for multiple hours', function () {
      const rawEvent = {
        color: 'green',
        start: new Date(2020, 0, 1, 12, 45),
        end: new Date(2020, 0, 1, 14, 45),
        description: 'desc'
      };
      const slots = makeSUT().slotsForRawEvents([rawEvent], 4);
      assert.equal(_.isEqual(slots[1245], { start: 1245, color: 'green', description: 'desc' }), true);
      assert.equal(_.isEqual(slots[1430], { start: 1430, color: 'green', description: 'desc' }), true);
    });
  });
  describe('normalizeEvents()', function () {
    it('events with times not in increments of 15 minutes extend to 15 minute slots', function () {
      const rawEvent = { color: 'green', start: new Date(2020, 0, 1, 12, 40), end: new Date(2020, 0, 1, 14, 40), description: 'desc' };
      const sut = makeSUT().normalizeEvents([rawEvent], 4);
      console.log(sut);
      assert.equal(sut[0].start, 1230);
      assert.equal(sut[0].end, 1445);
    });
  });
});

// HELPERS

function makeSUT() {
  return new ConcreteTimeSlotFactory(4, '-', '-', 8, 13);
}
