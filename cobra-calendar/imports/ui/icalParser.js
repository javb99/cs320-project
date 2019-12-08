import ical from 'ical';

async function parseCalendar (url) {
  const eventList = [];
  await icalParse(url, eventList);
  return eventList;
}
function icalParse(url, eventList) {
  return new Promise( resolve => {
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
      resolve();
    });
  });
}
let eventsPromise = parseCalendar('https://learn.wsu.edu/webapps/calendar/calendarFeed/4ed515a26d2b4187bb65e957a6bb8a43/learn.ics');
eventsPromise.then((events) => {console.log(events.length + " after return");});