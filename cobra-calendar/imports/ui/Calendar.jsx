import React from 'react'
import { Container, Grid, Button, Popup } from 'semantic-ui-react'
import * as _ from 'underscore';

const Calendar = (props) => {
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const events = [
    { color: 'yellow', start: 800, end: 900, description: 'This slot is blocked by 1 person' },
    { color: 'green', start: 900, end: 1000, description: 'This slot is open' },
    { color: 'yellow', start: 1311, end: 1400, description: 'This slot is blocked by 1 person' },
    { color: 'green', start: 1515, end: 1530, description: 'This slot is open' }
  ];
  return (
      <Container>
        <h1>{ titleForWeekStart(props.weekStart) }</h1>
        <Grid celled columns={days.length}>
          {days.map( (day, index) => (
              <Grid.Column key={index}>
                <Day name={day} date={ dateAddingDays(props.weekStart, index) } events={events} slotsPerHour={4} />
              </Grid.Column>
          ))}
        </Grid>
      </Container>
  )
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dateAddingDays = (date, daysOffset) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()+daysOffset)
}

const titleForWeekStart = (weekStart) => {
  const weekEndDate = dateAddingDays(weekStart, 6);
  return weekStart.getDate() + '-' + (weekEndDate.getDate()) + ' ' + months[weekStart.getMonth()] + ' ' + weekStart.getFullYear()
}

const normalizeEvents = (events, slotsPerHour) => {
  return events.map((event)=>{
    const slotLength = 60 / slotsPerHour;
    let start = event.start;
    const startMin = start % 100;
    if (startMin % slotLength > 0) {
      start = start + (slotLength - startMin % slotLength); // Round up to nearest slot.
    }
    let end = event.end;
    const endMin = end % 100;
    if (endMin % slotLength > 0) {
      end = end - endMin % slotLength; // Round down to nearest slot
    }
    return { color: event.color, start: start, end: end, description: event.description };
  })
};

const hour = 100;

const slotStartsFor = (start, end, slotLength) => {
  let times = [];
  for (let time = start; time < end;) {
    times.push(time);
    time += slotLength;
    if (time % hour >= 60) { // Check for 61 to 100, should increment the hour.
      time = (time % hour + 1) * hour;
    }
    console.log('time',time);
  }
  return times;
};

const splitEventsToSlots = (normalizedEvents, slotsPerHour) => {
  console.log('split', normalizedEvents, slotsPerHour);
  const eventSlots = _.flatten(_.map(normalizedEvents, (event)=>{
    let slotLength = 60 / slotsPerHour;
    console.log('event', event);
    const starts = slotStartsFor(event.start, event.end, slotLength);
    console.log(starts);
    return _.map(starts, (aStart)=>{
      console.log('aStart', aStart);
      return { color: event.color, start: aStart, description: event.description };
    });
  }));
  return _.indexBy(eventSlots, 'start');
};

const Day = (props) => {
    const eventSlots = splitEventsToSlots(normalizeEvents(props.events, props.slotsPerHour), props.slotsPerHour);
    const emptySlot =  { color: 'grey', description: 'This slot is blocked' };
    const segments = ["00", "15", "30", "45"];
    const times = ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7", "8"];
    return (
        <Grid columns={1}>
          <h1>{props.name + props.date.getDate()}</h1>
          {times.map( (time, row) => (
              <Grid.Row key={row} className='no-padding'>
                <Grid columns={4}>
                  {segments.map( (label, column) => {
                    const time = militaryTimeForIndex(row*segments.length + column);
                    const event = eventSlots[time] || emptySlot;
                    return <Grid.Column className='no-padding'>
                      <Popup content={event.description} trigger={<Button size='mini' color={event.color}/>} />
                    </Grid.Column>;
                  })}
                </Grid>
              </Grid.Row>
          ))}
        </Grid>
    );
};

export default Calendar;

// Takes an index in the 4/13 array representing 8am to 8pm and returns the integer representing the 24 hour time.
// For example index 0 -> 800, index 51 -> 2045
export function militaryTimeForIndex(index) {
  const minHour = 8;
  const columnCount = 4;
  const segmentLength = 15;//60 / columnCount;
  const row = Math.floor(index / columnCount);
  const col = index % columnCount;
  return col * segmentLength + (100 * (row + minHour));
}

