import React from 'react'
import { Container, Grid, Button, Popup } from 'semantic-ui-react'
import * as _ from 'underscore';
import ConcreteTimeSlotFactory from '../presentation/ConcreteTimeSlotFactory';
import Calendars from '../api/calendars';

const Calendar = ({calendar, weekStart, prev, next, goToToday}) => {
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return (
      <Container>
        <h1>
          <Button icon="angle left" onClick={prev}/>
          <Button icon="angle right" onClick={next}/>
          { titleForWeekStart(weekStart) }
          <Button onClick={goToToday}>Today</Button>
        </h1>
        <Grid celled columns={days.length}>
          {days.map( (day, index) => {
              const date = dateAddingDays(weekStart, index);
              return <Grid.Column key={index}>
                <Day name={day + date.getDate()} calendar={ new FilterCalendar(calendar, startDateMatches(date)) } slotsPerHour={4} />
              </Grid.Column>;
          })}
        </Grid>
      </Container>
  );
};

class FilterCalendar {
  constructor(calendar, predicate) {
    this.calendar = calendar;
    this.predicate = predicate;
  }
  getEvents() {
    const parentEvents = this.calendar.getEvents();
    return _.filter(parentEvents, this.predicate);
  }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const startDateMatches = (referenceDate) => {
  return (candidateEvent) => matchingDate(referenceDate)(candidateEvent.start);
};

const matchingDate = (referenceDate) => {
  return (candidateDate) => {
    return candidateDate.getDate() === referenceDate.getDate()
        && candidateDate.getFullYear() === referenceDate.getFullYear()
        && candidateDate.getMonth() === referenceDate.getMonth();
  };
};

export const dateAddingDays = (date, daysOffset) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()+daysOffset)
};

const titleForWeekStart = (weekStart) => {
  const weekEndDate = dateAddingDays(weekStart, 6);
  return weekStart.getDate() + '-' + (weekEndDate.getDate()) + ' ' + months[weekStart.getMonth()] + ' ' + weekStart.getFullYear()
};

const PureDay = ({name, eventSlots, slotsPerHour}) => {
    const rows = _.chunk(eventSlots, slotsPerHour); // Break into rows. 1 row per hour.
    return (
        <Grid columns={1}>
          <h1>{name}</h1>
          {rows.map( (rowSlots, row) => (
              <Grid.Row key={row} className='no-padding'>
                <Grid columns={slotsPerHour}>
                  {rowSlots.map( (slot, column) => (
                    <Grid.Column className='no-padding' key={column}>
                      <Popup content={slot.description} trigger={<Button size='mini' color={slot.color}/>} />
                    </Grid.Column>
                  ))}
                </Grid>
              </Grid.Row>
          ))}
        </Grid>
    );
};

const Day = ({name, calendar, slotsPerHour}) => {
  const timeSlotFactory = new ConcreteTimeSlotFactory(slotsPerHour, 'green', 'open', 8, 13);
  const eventSlots = timeSlotFactory.timeSlotsForCalendar(calendar);
  console.log('eventSlots: ', eventSlots);
  return PureDay({name, eventSlots, slotsPerHour});
};

export default Calendar;
