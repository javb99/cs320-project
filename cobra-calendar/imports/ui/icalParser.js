import ical from 'ical';

function parseCalendar (url) {
  const eventList = [];
  ical.fromURL(url, {}, function (err, data) {
    for (let k in data) {
      if (data.hasOwnProperty(k)) {
        const ev = data[k];
        if (data[k].type === 'VEVENT') {
          const userEvent = {
            eventStart: ev.start,
            eventEnd: ev.end
          };
          eventList.push(userEvent);
        }
      }
    }
    console.log(eventList.length + " inside fromURL");
  });
  console.log(eventList.length + " inside parse");
  return eventList;
}

let events = parseCalendar('https://learn.wsu.edu/webapps/calendar/calendarFeed/4ed515a26d2b4187bb65e957a6bb8a43/learn.ics');
console.log(events.length + " after return");
