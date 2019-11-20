import React from 'react'
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'

const Calendar = () => {
  const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"]
  return (
      <Container>
        <Grid celled columns={days.length}>
          {days.map( (day, index) => (
              <Grid.Column key={index}>
                <Day name={day}/>
              </Grid.Column>
          ))}
        </Grid>
      </Container>
  )
}

const Day = (props) => {
    const segments = ["00", "15", "30", "45"];
    const times = ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7", "8"]
    return (
        <Grid columns={1}>
          <h1>{props.name}</h1>
          {times.map( (time, row) => (
              <Grid.Column key={row}>
                <Grid>
                  {segments.map( (label, column) => {
                    return <Grid.Column>
                      {militaryTimeForIndex(row*segments.length + column)}
                    </Grid.Column>;
                  })}
                </Grid>
              </Grid.Column>
          ))}
        </Grid>
    );
}

export default Calendar;

// Takes an index in the 4/13 array representing 8am to 8pm and returns the integer representing the 24 hour time.
// For example index 0 -> 800, index 51 -> 2045
function militaryTimeForIndex(index) {
  const minHour = 8;
  const columnCount = 4;
  const segmentLength = 15;//60 / columnCount;
  const row = Math.floor(index / columnCount);
  const col = index % columnCount;
  return col * segmentLength + (100 * (row + minHour));
}
