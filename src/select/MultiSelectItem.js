import PropTypes from 'prop-types';
import React from 'react';

const Clear = (props) => <div className='select-multi-item-remove' {...props} />

const MultiSelectItem = ({ item, props, state, methods }) => {

	const remove = (event) => {
		event.stopPropagation();
		methods.removeItem(item);
	}

	return (
		<div
			role="listitem"
			direction={props.direction}
			className='select-multi-item'
		>
			<span
				className='select-multi-item-label'
			>
				{item[props.labelField]}
			</span>
			<Clear
				className='select-multi-item-remove'
				onClick={remove}
			/>
		</div>
	);
}

MultiSelectItem.propTypes = {
	item: PropTypes.object.isRequired,
	props: PropTypes.any,
	state: PropTypes.any,
	methods: PropTypes.any
}

export default MultiSelectItem;
