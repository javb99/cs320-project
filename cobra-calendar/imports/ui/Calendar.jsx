import React from 'react'
import { Container, Grid, Button, Popup } from 'semantic-ui-react'
import * as _ from 'underscore';
import ConcreteTimeSlotFactory from '../presentation/ConcreteTimeSlotFactory';

const Calendar = (props) => {
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const events = props.events;
  return (
      <Container>
        <h1>
          <Button icon="angle left" onClick={props.prev}/>
          <Button icon="angle right" onClick={props.next}/>
          { titleForWeekStart(props.weekStart) }
          <Button onClick={props.goToToday}>Today</Button>
        </h1>
        <Grid celled columns={days.length}>
          {days.map( (day, index) => {
              const date = dateAddingDays(props.weekStart, index);
              return <Grid.Column key={index}>
                <Day name={day + date.getDate()} events={ _.filter(events, startDateMatches(date)) } slotsPerHour={4} />
              </Grid.Column>;
          })}
        </Grid>
      </Container>
  );
};

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

const Day = ({name, events, slotsPerHour}) => {
  const timeSlotFactory = new ConcreteTimeSlotFactory(slotsPerHour, 'green', 'open', 0, 24);
  const eventSlots = timeSlotFactory.timeSlotsForCalendar({getEvents: ()=>events});
  console.log('eventSlots: ', eventSlots);
  return PureDay({name, eventSlots, slotsPerHour});
};

export default Calendar;
