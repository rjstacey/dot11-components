import React from 'react';
import Dropdown, {ActionButtonDropdown} from '.';
import {Select} from '../form';

const options = [
	{value: 1, label: 'One'},
	{Value: 2, label: 'Two'},
	{value: 3, label: 'Three'},
	{value: 4, label: 'Four'},
	{value: 5, label: 'Five'},
	{value: 6, label: 'Six'},
	{value: 7, label: 'Seven'},
	{value: 8, label: 'Eight'},
	{value: 9, label: 'Nine'}
];

function Content({close, state, setState}) {
	const changeState = changes => setState(state => ({...state, ...changes}));
	return (
		<form style={{width: '200px'}} onSubmit={(e) => e.preventDefault()}>
			<label><input type='radio' id='1' />Fred</label><br />
			<label><input type='radio' id='1' />Frog</label><br />
			<label>Text:
				<input type='text'
					size={24}
					value={state.text}
					onChange={e => changeState({text: e.target.value})} 
				/>
			</label>
			<label>Select:
				<Select
					values={state.selectValues}
					onChange={selectValues => changeState({selectValues})}
					options={options}
					dropdownHeight={150}
				/>
			</label>
			<button onClick={() => alert(JSON.stringify(state))}>OK</button>
			<button onClick={close}>Cancel</button>
		</form>
	)
}

const defaultState = {
	text: '',
	selectValues: [],
}

function Template({usePortal, Component, ...args}) {
	const [state1, setState1] = React.useState(defaultState);
	const [state2, setState2] = React.useState(defaultState);
	const [state3, setState3] = React.useState(defaultState);
	let portal;
	if (usePortal)
		portal = document.querySelector('#root');
	return (
		<div id='main' style={{display: 'flex', justifyContent: 'space-between'}}>
			<Component {...args} portal={portal}>
				<Content state={state1} setState={setState1} />
			</Component>
			<Component {...args} portal={portal}>
				<Content state={state2} setState={setState2} />
			</Component>
			<Component {...args} portal={portal}>
				<Content state={state3} setState={setState3} />
			</Component>
		</div>
	)
}

export const IconButton = Template.bind({});
IconButton.args = {
	name: 'add',
	title: 'Icon button',
	Component: ActionButtonDropdown
};

export const TextButton = Template.bind({});
TextButton.args = {
	label: 'Click Me',
	title: 'Label button',
	Component: ActionButtonDropdown
};

export const Label = Template.bind({});
Label.args = {
	label: 'Label',
	title: 'Add something',
	Component: Dropdown
};

const story = {
	title: 'Dropdown',
	component: Dropdown,
	argTypes: {
		usePortal: {type: 'boolean'},
		disabled: {type: 'boolean'},
	},
};

export default story;
