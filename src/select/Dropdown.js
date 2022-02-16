import React from 'react';
import styled from '@emotion/styled';
import {VariableSizeList as List} from 'react-window';

import { LIB_NAME } from './constants';
import { valueExistInSelected, hexToRGBA, getByPath } from './util';

function ItemWrapper({style, item, index, setHeight, props, state, methods}) {
	const ref = React.useRef();
	React.useEffect(() => {
		if (ref.current) {
			const bounds = ref.current.getBoundingClientRect();
			if (style.height !== bounds.height)
				setHeight(bounds.height);
		}
	});
	const key = `${getByPath(item, props.valueField)}${getByPath(item, props.labelField)}`;
	const el = props.itemRenderer({index, item, props, state, methods});
	return (
		<div style={style}>
			<div ref={ref}>
				{({key, ...el})}
			</div>
		</div>
	)
}

const Dropdown = React.forwardRef(({style, className, props, state, methods}, ref) => {

	const listRef = React.useRef();
	const heightsRef = React.useRef([]);

	const setItemHeight = (index, height) => {
		const heights = heightsRef.current;
		heights[index] = height;
		if (listRef.current)
			listRef.current.resetAfterIndex(index, true);
	}

	const getItemHeight = (index) => heightsRef.current[index] || props.estimatedItemHeight;

	const options = methods.searchResults();

	React.useEffect(() => {
		if (!listRef.current)
			return;
		if (state.cursor >= 0)
			listRef.current.scrollToItem(state.cursor);
	}, [state.cursor]);

	let cn = `${LIB_NAME}-dropdown`;
	if (className)
		cn += ' ' + className;

	return (
		<DropdownContainer
			ref={ref}
			style={style}
			className={cn}
			tabIndex="-1"
			role="list"
			height={props.dropdownHeight}
		>
			{props.create && state.search && !valueExistInSelected(state.search, [...state.values, ...props.options], props) &&
				<AddNew
					role="button"
					className={`${LIB_NAME}-dropdown-add-new`}
					color={props.color}
					onClick={() => methods.createNew(state.search)}>
					{props.createNewLabel.replace('{search}', `"${state.search}"`)}
				</AddNew>
			}
			{options.length === 0?
				props.noDataRenderer({props, state, methods}):
				<StyledList
					ref={listRef}
					height={300}
					itemCount={options.length}
					itemSize={getItemHeight}
					width='auto'
				>
					{({index, style}) =>
						<ItemWrapper 
							style={style}
							item={options[index]}
							index={index}
							setHeight={(height) => setItemHeight(index, height)}
							props={props}
							methods={methods}
							state={state}
						/>
					}
				</StyledList>
			}
		</DropdownContainer>
	)
});

const DropdownContainer = styled.div`
	padding: 0;
	display: flex;
	flex-direction: column;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 2px;
	box-shadow: 0 0 10px 0 ${hexToRGBA('#000000', 0.2)};
	max-height: ${({ height }) => height};
	overflow: auto;
	z-index: 9;

	:focus {
		outline: none;
	}
`;

const AddNew = styled.div`
	color: ${({ color }) => color};
	padding: 5px 10px;

	:hover {
		background: ${({ color }) => color && hexToRGBA(color, 0.1)};
		outline: none;
		cursor: pointer;
	}
`;

const StyledList = styled(List)`
	flex: 1;
`;

export default Dropdown;
