import React from 'react'
import { Container, Divider, Grid, Header, Menu, Message, Segment, Table } from 'semantic-ui-react'

const Calendar = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
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
    const times = ["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7", "8"]
    return (
        <Grid columns={1}>
          <h1>{props.name}</h1>
          {times.map( (time, index) => (
              <Grid.Column key={index}>{time}</Grid.Column>
          ))}
        </Grid>
    );
}

export default Calendar;
