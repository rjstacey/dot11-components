import React from 'react';

import Account from './Account';

export default {
  title: 'Account',
  component: Account,
};

export const Signout = (args) => 
  <div 
    style={{
      display: 'flex',
      justifyContent: 'space-between'
    }}
  >
    <Account {...args} />
    <Account {...args} />
  </div>

Signout.args = {
  user: {
  	Name: 'Fred Flintstone',
  	SAPIN: 112233,
    Username: 'fred.flintstone@pleistocene.info',
  	Access: 0,
  	logoutUrl: '/signout'
  },
};
