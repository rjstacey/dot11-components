import PropTypes from 'prop-types';
import React from 'react';

function Item({style, className, index, item, props, state, methods}) {

	const isSelected = methods.isSelected(item);
	const isDisabled = methods.isDisabled(item);
	const isActive = state.cursor === index;
	const isNew = props.create && state.search && index === 0;

	let cn = `select-dropdown-item`;
	if (isNew)
		cn += ` select-dropdown-item-new`;
	if (isActive)
		cn += ` select-dropdown-item-active`;
	if (isSelected)
		cn += ` select-dropdown-item-selected`;
	if (isDisabled)
		cn += ` select-dropdown-item-disabled`;
	if (className)
		cn += ' ' + className;

	const addItem = isDisabled? undefined: () => methods.addItem(item);

	return (
		<div
			style={style}
			className={cn}
			role="option"
			aria-selected={isSelected}
			aria-disabled={isDisabled}
			aria-label={item[props.labelField]}
			onClick={addItem}
			color={props.color}
		>
			{isNew?
				`Add "${item[props.labelField]}"`:
				item[props.labelField]
			} 
		</div>
	);
}

Item.propTypes = {
	index: PropTypes.number.isRequired,
	item: PropTypes.object,
	props: PropTypes.any,
	state: PropTypes.any,
	methods: PropTypes.any,
};

export default Item;
