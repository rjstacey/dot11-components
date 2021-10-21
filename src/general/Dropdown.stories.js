import React from 'react';

import Dropdown, {ActionButtonDropdown} from './Dropdown';
import {Select} from '../form';

const options = [
	{value: 1, label: 'One'},
	{Value: 2, label: 'Two'},
	{value: 3, label: 'Three'}
];

function Content() {
	const [text, setText] = React.useState('');
	const [value, setValue] = React.useState([]);
	return (
		<form style={{width: '200px'}}>
			<label><input type='radio' id='1' />Fred</label><br />
			<label><input type='radio' id='1' />Frog</label><br />
			<label>Text:
				<input type='text'
					size={24}
					value={text}
					onChange={e => setText(e.target.value)} 
				/>
			</label>
			<label>Select:
				<Select
					value={value}
					onChange={setValue}
					options={options}
					portal={document.querySelector('#root')}
				/>
			</label>
		</form>
	)
}

export default {
  title: 'Dropdown',
  component: ActionButtonDropdown,
  argTypes: {
  	alignLeft: {type: 'boolean'}
  }
};

export const IconButton = (args) =>
	<div style={{display: 'flex', justifyContent: 'space-between'}}>
		<ActionButtonDropdown {...args}>
			<Content />
		</ActionButtonDropdown>
		<ActionButtonDropdown {...args}>
			<Content />
		</ActionButtonDropdown>
		<ActionButtonDropdown {...args}>
			<Content />
		</ActionButtonDropdown>
	</div>

IconButton.args = {
  name: 'add',
  title: 'Add something',
};

export const LabelButton = (args) =>
	<div style={{display: 'flex', justifyContent: 'space-between'}}>
		<ActionButtonDropdown {...args}>
			<Content />
		</ActionButtonDropdown>
		<ActionButtonDropdown {...args}>
			<Content />
		</ActionButtonDropdown>
		<ActionButtonDropdown {...args}>
			<Content />
		</ActionButtonDropdown>
	</div>

LabelButton.args = {
  label: 'Click Me',
  title: 'Add something',
};

export const Default = (args) =>
	<div style={{display: 'flex', justifyContent: 'space-between'}}>
		<Dropdown {...args}>
			<Content />
		</Dropdown>
		<Dropdown {...args}>
			<Content />
		</Dropdown>
		<Dropdown {...args}>
			<Content />
		</Dropdown>
	</div>
Default.args = {
  label: 'Label',
  title: 'Add something',
};
