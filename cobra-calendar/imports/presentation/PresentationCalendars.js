import Calendars from '../api/calendars';
import * as _ from 'underscore';

export class GroupCalendar {
  constructor(memberIDs) {
    this.memberIDs = memberIDs
  }
  getCalendars() {
    return Calendars.find({ownerID: {$in: this.memberIDs}});
  }
  getEvents() {
    return _.flatten(_.toArray(this.getCalendars().map((cal)=>cal.events().fetch())));
  }
}

export class PresentableCalendar {
  constructor(calendar) {
    this.calendar = calendar;
  }
  getEvents() {
    const parentEvents = this.calendar.getEvents();
    return _.map(parentEvents, (event)=>({color:'white', description:'blocked', ...event}));
  }
}

export class FilterCalendar {
  constructor(calendar, predicate) {
    this.calendar = calendar;
    this.predicate = predicate;
  }
  getEvents() {
    const parentEvents = this.calendar.getEvents();
    return _.filter(parentEvents, this.predicate);
  }
}
