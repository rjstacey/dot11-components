import React from 'react';

export type SelectItemProps = {
	item: object;
	props: object;
	state: object;
	methods: object;
}

const SelectItem = ({item, props, state, methods}) =>
	<span
		className='dropdown-select-single-item'
	>
		{item[props.labelField]}
	</span>

export default SelectItem;
