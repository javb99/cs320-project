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
    const eventSlotsByMilitaryTime = slotsForRawEvents(calendar.getEvents(), this.slotsPerHour);
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
}

export const normalizeEvents = (events, slotsPerHour) => {
  return events.map((event)=>{
    const slotLength = base60Hour / slotsPerHour;
    let start = militaryTimeForDate(event.start);
    const startMin = start % base10Hour;
    if (startMin % slotLength > 0) {
      start = start - startMin % slotLength; // Round down to nearest slot
    }
    let end = militaryTimeForDate(event.end);
    const endMin = end % base10Hour;
    if (endMin % slotLength > 0) {
      end = end + (slotLength - endMin % slotLength); // Round up to nearest slot.
    }
    return { color: event.color, start: start, end: end, description: event.description };
  })
};

const slotStartsFor = (start, end, slotLength) => {
  let times = [];
  for (let time = start; time < end;) {
    times.push(time);
    time += slotLength;
    if (time % base10Hour >= base60Hour) { // Check for 61 to 100, should increment the hour.
      time = (Math.floor(time / base10Hour) + 1) * base10Hour;
    }
  }
  return times;
};

const splitEventsToSlots = (normalizedEvents, slotsPerHour) => {
  const eventSlots = _.flatten(_.map(normalizedEvents, (event)=>{
    let slotLength = base60Hour / slotsPerHour;
    const starts = slotStartsFor(event.start, event.end, slotLength);
    return _.map(starts, (aStart)=>{
      return { color: event.color, start: aStart, description: event.description };
    });
  }));
  return _.indexBy(eventSlots, 'start');
};

export const slotsForRawEvents = (events, slotsPerHour) => {
  return splitEventsToSlots(normalizeEvents(events, slotsPerHour), slotsPerHour);
};

function militaryTimeForDate(date) {
  return date.getHours() * base10Hour + date.getMinutes()
}
