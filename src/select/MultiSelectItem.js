import PropTypes from 'prop-types';
import React from 'react';

const Clear = (props) => <div className='dropdown-select-multi-item-remove' {...props} />

const MultiSelectItem = ({item, props, state, methods}) => {

	const remove = (event) => {
		event.stopPropagation();
		methods.removeItem(item);
	}

	return (
		<div
			role="listitem"
			direction={props.direction}
			className='dropdown-select-multi-item'
		>
			<span
				className='dropdown-select-multi-item-label'
			>
				{item[props.labelField]}
			</span>
			{!props.readOnly &&
				<Clear
					className='dropdown-select-multi-item-remove'
					onClick={remove}
				/>}
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
