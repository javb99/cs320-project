import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const Public = ({ loggingIn, authenticated, component, ...rest }) => (
    <Route {...rest} render={(props) => {
      if (loggingIn) return <div></div>;
      return !authenticated ?
          (React.createElement(component, { ...props, loggingIn, authenticated })) :
          (<Redirect to="/" />);
    }} />
);

export default Public;
