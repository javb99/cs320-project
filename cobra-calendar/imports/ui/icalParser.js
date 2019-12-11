import ical from 'ical';

export function parseCalendar (data) {
  const eventList = [];
  for (let k in data) {
    if (data.hasOwnProperty(k)) {
      const ev = data[k];
      if (ev.type === 'VEVENT') {
        const userEvent = {
          start: ev.start,
          end: ev.end
        };
        eventList.push(userEvent);
      }
    }
  }
  return eventList;
}
export default function parseICalContentsOf(url) {
  return new Promise( resolve => {
    ical.fromURL(url, {}, function (err, data) {
      console.log('parsing data', data, 'error', err);
      resolve(parseCalendar(data));
    });
  });
}
//let eventsPromise = parseCalendar(icalParse('https://learn.wsu.edu/webapps/calendar/calendarFeed/4ed515a26d2b4187bb65e957a6bb8a43/learn.ics'));
//eventsPromise.then((events) => {console.log(events.length + " after return");});
