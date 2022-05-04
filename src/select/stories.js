import React from 'react';
import {LoremIpsum} from 'lorem-ipsum';
import {AppModal} from '../modals';
import Select from '.';

const lorem = new LoremIpsum();

const genOptions = (n) => Array(n).fill().map((value, index) => ({value: index, label: lorem.generateWords(4), disabled: Math.random() > 0.8}));

function WrappedSelect(args) {
	const {usePortal, useCreate, portalRef, numberOfItems, onChange, ...otherArgs} = args;
	const [select, setSelect] = React.useState([]);
	const [options, setOptions] = React.useState(() => genOptions(numberOfItems));

	function addOption({props, state, methods}) {
		const newItem = {
			value: options.length,
			label: state.search
		}
		const newOptions = [...options, newItem];
		setOptions(newOptions);
		return newItem;
	}

	if (usePortal)
		otherArgs.portal = portalRef.current;

	if (useCreate) {
		otherArgs.createOption = addOption;
		otherArgs.create = true;
	}

	return (
		<Select
			options={options}
			values={select}
			onChange={setSelect}
			{...otherArgs}
		/>
	)
}

export function BasicSelect(args) {
	const portalRef = React.useRef();
	const style = {
		display: 'flex',
		width: '300px'
	}
	return (
		<div style={style}>
			<WrappedSelect portalRef={portalRef} {...args} />
		</div>
	)
}

export function ContainedSelect(args) {
	const portalRef = React.useRef();
	const style = {
		overflow: 'hidden',
		width: '300px',
		height: '200px',
		border: '2px dashed black',
	}
	return (
		<div ref={portalRef} style={style}>
			<WrappedSelect portalRef={portalRef} {...args} />
		</div>
	)
}
ContainedSelect.args = {
	usePortal: true
}

export function SelectInModal(args) {
	const portalRef = {};
	portalRef.current = document.querySelector('#root');
	return (
		<AppModal
			isOpen={true}
		>
			<label>Select:</label>
			<WrappedSelect portalRef={portalRef} {...args} />
		</AppModal>
	)
}

const story = {
	title: 'Select',
	component: Select,
	args: {
		numberOfItems: 100,
		usePortal: false,
		useCreate: false
	},
};

export default story;
