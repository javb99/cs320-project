import React from 'react'
import { Container, Grid } from 'semantic-ui-react'

const Calendar = (props) => {
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  return (
      <Container>
        <h1>{ titleForWeekStart(props.weekStart) }</h1>
        <Grid celled columns={days.length}>
          {days.map( (day, index) => (
              <Grid.Column key={index}>
                <Day name={day} date={ dateAddingDays(props.weekStart, index) } />
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

const Day = (props) => {
    const segments = ["00", "15", "30", "45"];
    const times = ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7", "8"];
    return (
        <Grid columns={1}>
          <h1>{props.name + props.date.getDate()}</h1>
          {times.map( (time, row) => (
              <Grid.Row key={row}>
                <Grid columns={4}>
                  {segments.map( (label, column) => {
                    return <Grid.Column color={column%2===0 ? 'red' : 'blue'}>
                      {militaryTimeForIndex(row*segments.length + column)}
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

