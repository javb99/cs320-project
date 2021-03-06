import { Menu } from 'semantic-ui-react';
import { Meteor } from "meteor/meteor";
import React from 'react';
import CobraLogo from './CobraLogo';

const AppMenu = () => {
  return(
    <Menu>
      <Menu.Item header href='/'><CobraLogo />Cobra Calendar</Menu.Item>
      <Menu.Item
        href='/profile'
        name='Profile'
        position='right'
      />
      <Menu.Item
        name='Help'
        onClick={null}
      />
      <Menu.Item
        name='Log Out'
        onClick={() => {Meteor.logout()}}
      />
    </Menu>
  );
};

export default AppMenu;
