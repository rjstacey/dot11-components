import React from 'react';

import {availableIcons, Icon} from '.';

const story = {
  title: 'Icon',
  component: Icon,
};

export const AvailableIcons = (args) =>
	<div style={{display: 'flex', flexDirection: 'column'}}>
		{availableIcons.map(type => <div key={type} style={{display: 'flex'}}><div style={{width: 250}}>{type}:</div><Icon type={type} /></div>)}
	</div>

export default story;
