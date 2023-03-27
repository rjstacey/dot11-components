import React from 'react';
import type { ItemType, SelectInternalProps, SelectState, SelectMethods } from './index';

type MultiSelectItemProps = {
	style?: React.CSSProperties;
	className?: string;
	item: ItemType;
	props: SelectInternalProps;
	state: SelectState;
	methods: SelectMethods;
};

const Clear = (props) => <div {...props} />

const MultiSelectItem = ({item, props, state, methods}: MultiSelectItemProps) => {

	const remove = (event: React.MouseEvent) => {
		event.stopPropagation();
		methods.removeItem(item);
	}

	return (
		<div
			role="listitem"
			//direction={props.direction}
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

export default MultiSelectItem;
