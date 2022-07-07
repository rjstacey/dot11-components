import PropTypes from 'prop-types';
import React from 'react';

function Item({style, className, index, item, props, state, methods}) {

	const isSelected = methods.isSelected(item);
	const isDisabled = methods.isDisabled(item);
	const isActive = state.cursor === index;
	const isNew = props.create && state.search && index === 0;

	let cn = `dropdown-select-item`;
	if (isNew)
		cn += ` dropdown-select-item-new`;
	if (isActive)
		cn += ` dropdown-select-item-active`;
	if (isSelected)
		cn += ` dropdown-select-item-selected`;
	if (isDisabled)
		cn += ` dropdown-select-item-disabled`;
	if (className)
		cn += ' ' + className;

	const addItem =
		isDisabled?
			undefined:
			isNew?
				() => methods.addSearchItem():
				() => methods.addItem(item);

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
	item: PropTypes.object.isRequired,
	props: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
	methods: PropTypes.object.isRequired,
};

export default Item;
