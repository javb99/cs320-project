import * as _ from 'underscore';

const base10Hour = 100;
const base60Hour = 60;

export default class ConcreteTimeSlotFactory {

  constructor(slotsPerHour, emptyColor, emptyDescription, firstHour, hourCount) {
    console.assert(base60Hour % slotsPerHour === 0, 'slotsPerHour must divide 60 minutes evenly');
    this.slotsPerHour = slotsPerHour;
    this.slotLength = base60Hour / slotsPerHour
    this.emptySlot = { color: emptyColor, description: emptyDescription };
    this.firstHour = firstHour;
    this.hourCount = hourCount;
  }

  timeSlotsForCalendar(calendar) {
    const eventSlotsByMilitaryTime = this.slotsForRawEvents(calendar.getEvents());
    const timeSlots = _.range(this.hourCount).flatMap( (row) => (
        _.range(this.slotsPerHour).map( (col) => {
          return eventSlotsByMilitaryTime[this.militaryTimeFor(row, col)] || this.emptySlot;
        })
    ));
    return timeSlots
  }

  militaryTimeFor(row, column) {
    return column * this.slotLength + (base10Hour * (row + this.firstHour));
  }

  normalizeEvents(events) {
    return events.map((event)=>{
      const slotLength = this.slotLength;
      let start = this.militaryTimeForDate(event.start);
      const startMin = start % base10Hour;
      if (startMin % slotLength > 0) {
        start = start - startMin % slotLength; // Round down to nearest slot
      }
      let end = this.militaryTimeForDate(event.end);
      const endMin = end % base10Hour;
      if (endMin % slotLength > 0) {
        end = end + (slotLength - endMin % slotLength); // Round up to nearest slot.
      }
      return { color: event.color, start: start, end: end, description: event.description };
    })
  }

  slotStartsFor(start, end) {
    let times = [];
    for (let time = start; time < end;) {
      times.push(time);
      time += this.slotLength;
      if (time % base10Hour >= base60Hour) { // Check for 61 to 100, should increment the hour.
        time = (Math.floor(time / base10Hour) + 1) * base10Hour;
      }
    }
    return times;
  }

  splitEventsToSlots(normalizedEvents, slotsPerHour) {
    const eventSlots = _.flatten(_.map(normalizedEvents, (event) => {
      const starts = this.slotStartsFor(event.start, event.end);
      return _.map(starts, (aStart)=>{
        return { color: event.color, start: aStart, description: event.description };
      });
    }));
    return _.indexBy(eventSlots, 'start');
  }

  slotsForRawEvents(events) {
    return this.splitEventsToSlots(this.normalizeEvents(events));
  }

  militaryTimeForDate(date) {
    return date.getHours() * base10Hour + date.getMinutes()
  }
}
