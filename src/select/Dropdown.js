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
	const key = '' + item[props.valueField] + item[props.labelField];
	const el = props.itemRenderer({index, item, props, state, methods});
	return (
		<div style={style}>
			<div ref={ref}>
				{({key, ...el})}
			</div>
		</div>
	)
}

const Dropdown = ({style, className, dropdownRef, props, state, methods}) => {

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
	});

	let cn = `select-dropdown`;
	if (className)
		cn += ' ' + className;

	const itemKey = (index) => '' + options[index][props.valueField] + options[index][props.valueField];

	return (
		<div
			ref={dropdownRef}
			style={style}
			className={cn}
			role="list"
			onClick={e => e.stopPropagation()}	// prevent click propagating to select and closing the dropdown
		>
			{options.length === 0?
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
		</div>
	)
}

Dropdown.propTypes = {
	dropdownRef: PropTypes.object.isRequired,
	props: PropTypes.object.isRequired,
	state: PropTypes.object.isRequired,
	methods: PropTypes.object.isRequired
}

export default Dropdown;
