import React from "react";
import type {
	ItemType,
	SelectInternalProps,
	SelectState,
	SelectMethods,
} from "./index";

type ItemProps = {
	style?: React.CSSProperties;
	className?: string;
	index: number;
	item: ItemType;
	props: SelectInternalProps;
	state: SelectState;
	methods: SelectMethods;
};

function Item({
	style,
	className,
	index,
	item,
	props,
	state,
	methods,
}: ItemProps) {
	const isSelected = methods.isSelected(item);
	const isDisabled = methods.isDisabled(item);
	const isActive = state.cursor === index;
	const isNew = props.create && state.search && index === 0;

	let cn = `dropdown-select-item`;
	if (isNew) cn += ` dropdown-select-item-new`;
	if (isActive) cn += ` dropdown-select-item-active`;
	if (isSelected) cn += ` dropdown-select-item-selected`;
	if (isDisabled) cn += ` dropdown-select-item-disabled`;
	if (className) cn += " " + className;

	const addItem = isDisabled
		? undefined
		: isNew
		? () => methods.addSearchItem()
		: () => methods.addItem(item);

	const label = item[props.labelField];

	return (
		<div
			style={style}
			className={className}
			role="option"
			aria-selected={isSelected}
			aria-disabled={isDisabled}
			aria-label={label}
			onClick={addItem}
		>
			{isNew ? `Add "${label}"` : label}
		</div>
	);
}

export default Item;
