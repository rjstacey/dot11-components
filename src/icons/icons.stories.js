import React from 'react';

import {availableIcons, Icon} from '.';

export default {
  title: 'Icon',
  component: Icon,
};

export const AvailableIcons = (args) =>
	<div style={{display: 'flex', flexDirection: 'column'}}>
		{Object.keys(availableIcons).map(name => <div key={name} style={{display: 'flex'}}><div style={{width: 250}}>{name}:</div><Icon name={name} /></div>)}
	</div>

