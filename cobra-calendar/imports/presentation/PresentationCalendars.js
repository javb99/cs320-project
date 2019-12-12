import Calendars from '../api/calendars';
import * as _ from 'underscore';

export class RealCalendar {
  constructor(calendarDocument) {
    this.calendarDocument = calendarDocument
  }
  getEvents() {
    return this.calendarDocument.events().fetch();
  }
}

export function realCalendarsForUserIDs(userIDs) {
  return Calendars.find({ownerID: {$in: userIDs}}).map( (cal) => new RealCalendar(cal));
}

export class GroupCalendar {
  constructor(memberIDs, getCalendarsForMemberIDs) {
    this.memberIDs = memberIDs;
    this.getCalendarsForMemberIDs = getCalendarsForMemberIDs || realCalendarsForUserIDs;
  }
  getEvents() {
    const calendars = this.getCalendarsForMemberIDs(this.memberIDs);
    return _.flatten(_.toArray(calendars.map((cal)=>cal.getEvents())));
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
