import PropTypes from 'prop-types';
import React from 'react';
import {VariableSizeList as List} from 'react-window';

/* ItemWrapper measures and sets the height of the item */
function ItemWrapper({style, item, index, setHeight, props, state, methods}) {

	const ref = React.useRef();
	React.useEffect(() => {
		if (ref.current) {
			const bounds = ref.current.getBoundingClientRect();
			if (style.height !== bounds.height)
				setHeight(bounds.height);
		}
	});

	const isSelected = methods.isSelected(item);
	const isDisabled = methods.isDisabled(item);
	const isActive = state.cursor === index;
	const isNew = props.create && state.search && index === 0;

	let className = `dropdown-select-item`;
	if (isNew)
		className += ` dropdown-select-item-new`;
	if (isActive)
		className += ` dropdown-select-item-active`;
	if (isSelected)
		className += ` dropdown-select-item-selected`;
	if (isDisabled)
		className += ` dropdown-select-item-disabled`;

	const addItem = isNew?
			() => methods.addSearchItem():
			() => methods.addItem(item);

	return (
		<div
			style={style}
		>
			<div
				ref={ref}
				className={className}
				onClick={isDisabled? undefined: addItem}
				role="option"
				aria-selected={isSelected}
				aria-disabled={isDisabled}
				aria-label={item[props.labelField]}
			>
				{props.itemRenderer({index, item, props, state, methods})}
			</div>
		</div>
	)
}

function Dropdown({props, state, methods}) {

	const listRef = React.useRef();
	const listInnerRef = React.useRef();
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

	const [maxHeight, setMaxHeight] = React.useState(props.dropdownHeight);

	React.useLayoutEffect(() => {
		if (!listInnerRef.current)
			return;
		const bounds = listInnerRef.current.getBoundingClientRect();
		const height = bounds.height < props.dropdownHeight? bounds.height: props.dropdownHeight;
		if (height !== maxHeight)
			setMaxHeight(height);
	}, [props.dropdownHeight, maxHeight]);

	const itemKey = (index) => '' + options[index][props.valueField] + options[index][props.labelField];

	return options.length === 0?
		props.noDataRenderer({props, state, methods}):
		<List
			ref={listRef}
			height={maxHeight}
			width='auto'
			itemCount={options.length}
			itemSize={getItemHeight}
			estimatedItemSize={props.estimatedItemHeight}
			itemKey={itemKey}
			innerRef={listInnerRef}
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
		</List>
}

Dropdown.propTypes = {
	props: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
	methods: PropTypes.object.isRequired
}

export default Dropdown;
