import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { hexToRGBA, getByPath } from './util';
import { LIB_NAME } from './constants';

function Item({style, className, index, item, props, state, methods}) {

	const isSelected = methods.isSelected(item);
	const isActive = methods.isActive(item, index);
	const isDisabled = methods.isDisabled(item);

	let cn = `${LIB_NAME}-item`;
	if (isSelected)
		cn += ` ${LIB_NAME}-item-selected`;
	if (isActive)
		cn += ` ${LIB_NAME}-item-active`;
	if (isDisabled)
		cn += ` ${LIB_NAME}-item-disabled`;
	if (className)
		cn += ' ' + className;

	let addItem;
	if (!isDisabled)
		addItem = () => methods.addItem(item);

	return (
		<ItemComponent
			style={style}
			className={cn}
			role="option"
			aria-selected={isSelected}
			aria-disabled={isDisabled}
			aria-label={getByPath(item, props.labelField)}
			tabIndex="-1"
			onClick={addItem}
			onKeyPress={addItem}
			color={props.color}
		>
			{getByPath(item, props.labelField)} {item.disabled && <ins>{props.disabledLabel}</ins>}
		</ItemComponent>
	);
}

Item.propTypes = {
	index: PropTypes.number.isRequired,
	item: PropTypes.object,
	props: PropTypes.any,
	state: PropTypes.any,
	methods: PropTypes.any,
};

const ItemComponent = styled.div`
	padding: 5px 10px;
	cursor: pointer;
	border-bottom: 1px solid #fff;

	&.${LIB_NAME}-item-active:not(.${LIB_NAME}-item-disabled) {
		${({ color }) => color && `background: ${hexToRGBA(color, 0.1)};`}
	}

	:hover,
	:focus {
		background: ${({ color }) => color && hexToRGBA(color, 0.1)};
		outline: none;
	}

	&.${LIB_NAME}-item-selected {
		background: ${({color}) => color};
		color: #fff;
		border-bottom: 1px solid #fff;
	}

	&.${LIB_NAME}-item-disabled {
		background: #f2f2f2;
		color: #ccc;

		ins {
			text-decoration: none;
			border:1px solid #ccc;
			border-radius: 2px;
			padding: 0px 3px;
			font-size: x-small;
			text-transform: uppercase;
		}
	}
`;

export default Item;
