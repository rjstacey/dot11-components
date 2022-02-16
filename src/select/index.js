import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

import Content from './Content';
import Dropdown from './Dropdown';
import Item from './Item';
import NoData from './NoData';
import Option from './Option';
import Input from './Input';
import Loading from './Loading';
import Clear from './Clear';
import Separator from './Separator';
import DropdownHandle from './DropdownHandle';

import {
	debounce,
	hexToRGBA,
	getByPath,
	getProp,
	valueExistInSelected,
	isomorphicWindow
} from './util';
import { LIB_NAME } from './constants';

class Select extends React.Component {
	static propTypes = {
		options: PropTypes.array.isRequired,
		values: PropTypes.array,
		onChange: PropTypes.func.isRequired,
		onDropdownClose: PropTypes.func,
		onDropdownOpen: PropTypes.func,
		autoFocus: PropTypes.bool,
		keepOpen: PropTypes.bool,
		dropdownGap: PropTypes.number,
		multi: PropTypes.bool,
		create: PropTypes.bool,
		placeholder: PropTypes.string,
		addPlaceholder: PropTypes.string,
		disabled: PropTypes.bool,
		className: PropTypes.string,
		dropdownClassName: PropTypes.string,
		loading: PropTypes.bool,
		clearable: PropTypes.bool,
		searchable: PropTypes.bool,
		separator: PropTypes.bool,
		keepSelectedInList: PropTypes.bool,
		dropdownHandle: PropTypes.bool,
		searchBy: PropTypes.string,
		sortBy: PropTypes.string,
		closeOnScroll: PropTypes.bool,
		style: PropTypes.object,
		direction: PropTypes.string,
		backspaceDelete: PropTypes.bool,
		contentRenderer: PropTypes.func,
		dropdownRenderer: PropTypes.func,
		itemRenderer: PropTypes.func,
		noDataRenderer: PropTypes.func,
		optionRenderer: PropTypes.func,
		inputRenderer: PropTypes.func,
		loadingRenderer: PropTypes.func,
		clearRenderer: PropTypes.func,
		separatorRenderer: PropTypes.func,
		dropdownHandleRenderer: PropTypes.func,
		valuesEqual: PropTypes.func
	}


	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			values: props.values,
			search: '',
			selectBounds: {},
			cursor: null,
			searchResults: props.options,
		};

		this.methods = {
			open: this.open,
			close: this.close,
			removeItem: this.removeItem,
			addItem: this.addItem,
			createNew: this.createNew,
			setSearch: this.setSearch,
			getInputSize: this.getInputSize,
			clearAll: this.clearAll,
			isSelected: this.isSelected,
			isActive: this.isActive,
			isDisabled: this.isDisabled,
			areAllSelected: this.areAllSelected,
			handleKeyDown: this.handleKeyDown,
			sort: this.sort,
			searchFilter: this.searchFilter,
			searchResults: this.searchResults,
		};

		this.selectRef = React.createRef();
		this.dropdownRef = React.createRef();

		this.debouncedUpdateSelectBounds = debounce(this.updateSelectBounds);
		this.debouncedOnScroll = debounce(this.onScroll);
	}

	componentDidUpdate(prevProps, prevState) {
		const {props, state} = this;

		if (!props.valuesEqual(prevProps.values, props.values) &&
			props.valuesEqual(prevProps.values, prevState.values)
		) {
			this.setState({values: this.props.values},
				() => this.props.onChange(this.state.values)
			);
		}

		if (prevProps.options !== props.options ||
			prevProps.keepSelectedInList !== props.keepSelectedInList ||
			prevProps.sortBy !== props.sortBy
		) {
			this.setState({
				cursor: null,
				searchResults: this.searchResults()
			});
		}

		if (prevState.values !== state.values) {
			props.onChange(state.values);
		}

		if (prevProps.multi !== props.multi ||
			prevState.search !== state.search ||
			prevState.values !== state.values
		) {
			this.updateSelectBounds();
		}
	}

	onClick = (event) => {
		const {state} = this;

		// Ignore if not open
		if (!state.isOpen)
			return;

		const {target} = event;

		// Ignore click in dropdown
		const dropdownEl = this.dropdownRef.current;
		if (dropdownEl && (dropdownEl === target || dropdownEl.contains(target)))
			return;
		
		// Ignore click in select
		const selectEl = this.selectRef.current;
		if (selectEl && (selectEl === target || selectEl.contains(target)))
			return;

		this.close();
	}

	onScroll = () => {
		if (this.props.closeOnScroll) {
			this.close();
			return;
		}

		this.updateSelectBounds();
	}

	updateSelectBounds = () => {
		if (!this.selectRef.current)
			return;
		const selectBounds = this.selectRef.current.getBoundingClientRect();
		this.setState({selectBounds});
	}

	open = () => {
		const {props, state} = this;
		if (state.isOpen)
			return;

		window.addEventListener('resize', this.debouncedUpdateSelectBounds);
		window.addEventListener('scroll', this.debouncedOnScroll);
		document.addEventListener('click', this.onClick, true);

		this.updateSelectBounds();

		let cursor = null;
		if (!props.multi && state.values.length > 0) {
			// Position cursor on selected value
			const item = state.values[0];
			cursor = state.searchResults.findIndex(o => props.valuesEqual(item, o));
			if (cursor < 0)
				cursor = null;
		}
		this.setState({isOpen: true, cursor});

		props.onDropdownOpen();
	}

	close = () => {
		const {props, state} = this;
		if (!state.isOpen)
			return;

		window.removeEventListener('resize', this.debouncedUpdateSelectBounds);
		window.removeEventListener('scroll', this.debouncedOnScroll);
		document.removeEventListener('click', this.onClick, true);

		this.setState({
			isOpen: false,
			search: props.clearOnBlur ? '' : state.search,
			searchResults: props.options,
			cursor: null
		});

		props.onDropdownClose();
	}

	addItem = (item) => {
		const {props, state} = this;
		let values;
		if (props.multi) {
			if (valueExistInSelected(getByPath(item, props.valueField), state.values, props))
				return this.removeItem(item);

			values = [...state.values, item];
		}
		else {
			values = [item];
			this.close();
		}
		this.setState({values});

		if (props.clearOnSelect) {
			this.setState({search: ''},
				() => this.setState({searchResults: this.searchResults()})
			);
		}

		return true;
	};

	removeItem = (item) => {
		const {props, state} = this;
		const values = state.values.filter((values) => getByPath(values, props.valueField) !== getByPath(item, props.valueField));
		this.setState({values});
	};

	setSearch = (search) => {
		this.setState({search},
			() => this.setState({
				cursor: null,
				searchResults: this.searchResults()
			})
		);
	};

	getInputSize = () => {
		const {props, state} = this;
		if (state.search)
			return state.search.length;
		if (state.values.length > 0)
			return props.addPlaceholder.length;
		return props.placeholder.length;
	};

	clearAll = () => this.setState({values: []});

	isSelected = (item) => {
		const {props, state} = this;
		return !!state.values.find((value) => getByPath(value, props.valueField) === getByPath(item, props.valueField));
	}

	isActive = (item, index) => {
		const {state} = this;
		return state.cursor === index;
	}

	isDisabled = (item) => {
		return !!item.disabled;
	}

	areAllSelected = () => {
		const {props, state} = this;
		return state.values.length === props.options.filter((option) => !option.disabled).length;
	}

	sort = (options, sortBy) => {
		if (!sortBy)
			return options;

		return options
			.sort((a, b) => {
				if (getProp(a, sortBy) < getProp(b, sortBy)) {
					return -1;
				} else if (getProp(a, sortBy) > getProp(b, sortBy)) {
					return 1;
				} else {
					return 0;
				}
			});
	}

	searchFilter = (options, search) => {
		const safeString = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regexp = new RegExp(safeString, 'i');

		return options
			.filter((item) =>
				regexp.test(getByPath(item, this.props.searchBy) || getByPath(item, this.props.valueField))
			);
	}

	searchResults = () => {
		const {props, state, methods} = this;

		let {options} = props;
		if (!props.keepSelectedInList)
			options = options.filter(item => methods.isSelected(item));
		options = methods.searchFilter(options, state.search);
		options = methods.sort(options, props.sortBy);
		return options;
	};

	handleKeyDown = (event) => {
		const {props, state} = this;

		const escape = event.key === 'Escape';
		const enter = event.key === 'Enter';
		const arrowUp = event.key === 'ArrowUp';
		const arrowDown = event.key === 'ArrowDown';
		const backspace = event.key === 'Backspace';
		const tab = event.key === 'Tab' && !event.shiftKey;
		const shiftTab = event.key === 'Tab' && event.shiftKey;

		if (backspace && props.backspaceDelete && this.getInputSize() === 0) {
			this.setState({values: state.values.slice(0, -1)});
		}

		if (!state.isOpen) {
			if (arrowDown || enter) {
				this.open();
				this.setState({cursor: 0});
			}
			return;	// Not open so nothing more to do
		}

		// Only get here if open
		if (escape || tab || shiftTab) {
			this.close();
		}

		if (enter) {
			if (state.cursor === null) {
				if (props.create &&
					state.search &&
					!valueExistInSelected(state.search, [...state.values, ...props.options], props)
				) {
					this.createNew(state.search);
				}
			}
			else {
				const currentItem = state.searchResults[state.cursor];
				if (currentItem &&
					!currentItem.disabled &&
					!valueExistInSelected(state.search, state.values, props)
				) {
					this.addItem(currentItem);
				}
			}
		}

		if (arrowDown || arrowUp) {
			let {cursor} = state;
			if (cursor === null) {
				cursor = 0;
			}
			else {
				if (arrowDown) {
					if (cursor === state.searchResults.length)
						cursor = 0;
					else 
						cursor += 1;
				}
				else {	// arrowUp
					if (cursor === 0)
						cursor = state.searchResults.length - 1;
					else
						cursor -= 1;
				}
			}
			this.setState({cursor});
		}
	}

	renderDropdown = (dropdownProps) => {
		const {props, state} = this;
		const {selectBounds} = state;

		// Determine if above or below selector
		let position = props.dropdownPosition;
		if (position === 'auto') {
			const dropdownHeight = selectBounds.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);
			if (dropdownHeight > isomorphicWindow().innerHeight && dropdownHeight > selectBounds.top)
				position = 'top';
			else
				position = 'bottom';
		}

		const style = {width: selectBounds.width};
		if (props.portal) {
			style.position = 'fixed';
			style.left = selectBounds.left - 1;
			if (position === 'bottom')
				style.top = selectBounds.bottom + props.dropdownGap;
			else 
				style.bottom = isomorphicWindow().innerHeight - selectBounds.top + props.dropdownGap;
		}
		else {
			style.position = 'absolute';
			style.left = -1;
			if (position === 'bottom')
				style.top = selectBounds.height + 2 + props.dropdownGap;
			else
				style.bottom = selectBounds.height + 2 + props.dropdownGap;
		}

		const dropdownEl = props.dropdownRenderer({...dropdownProps, ref: this.dropdownRef, style, className: props.dropdownClassName});

		return props.portal? ReactDOM.createPortal(dropdownEl, props.portal): dropdownEl;
	}

	createNew = (value) => {
		const {props} = this;
		const item = {
			[props.labelField]: value,
			[props.valueField]: value
		};

		this.addItem(item);
		this.setState({search: ''});
	}

	render() {
		const {props, state, methods} = this;

		let cn = LIB_NAME;
		if (props.disabled)
			cn += ` ${LIB_NAME}-disabled`;
		if (props.className)
			cn += ` ${props.className}`;

		return (
			<SelectContainer
				ref={this.selectRef}
				style={props.style}
				className={cn}
				tabIndex={props.disabled ? '-1' : '0'}
				aria-label="Dropdown select"
				aria-expanded={state.isOpen}
				onClick={(props.disabled || props.keepOpen)? undefined: (state.isOpen? this.close: this.open)}
				onKeyDown={this.handleKeyDown}
				direction={props.direction}
				{...props.additionalProps}
			>
				{props.contentRenderer({props, state, methods})}

				{props.loading && props.loadingRenderer({props, state, methods})}

				{props.clearable && props.clearRenderer({props, state, methods})}

				{props.separator && props.separatorRenderer({props, state, methods})}

				{props.dropdownHandle && props.dropdownHandleRenderer({props, state, methods})}

				{(state.isOpen || props.keepOpen) && !props.disabled && this.renderDropdown({props, state, methods})}
			</SelectContainer>
		)
	}
}

Select.defaultProps = {
	addPlaceholder: '',
	placeholder: 'Select...',
	values: [],
	options: [],
	multi: false,
	disabled: false,
	searchBy: 'label',
	sortBy: null,
	clearable: false,
	searchable: true,
	dropdownHandle: true,
	separator: false,
	keepOpen: undefined,
	noDataLabel: 'No data',
	createNewLabel: 'add {search}',
	disabledLabel: 'disabled',
	dropdownGap: 5,
	closeOnScroll: false,
	loading: false,
	labelField: 'label',
	valueField: 'value',
	color: '#0074D9',
	keepSelectedInList: true,
	closeOnSelect: false,
	clearOnBlur: true,
	clearOnSelect: true,
	dropdownPosition: 'bottom',
	dropdownHeight: '300px',
	estimatedItemHeight: 29.67,
	autoFocus: false,
	portal: null,
	create: false,
	direction: 'ltr',
	onChange: () => undefined,
	onDropdownOpen: () => undefined,
	onDropdownClose: () => undefined,
	searchFn: () => undefined,
	handleKeyDownFn: () => undefined,
	additionalProps: null,
	backspaceDelete: true,
	valuesEqual: (a, b) => a === b,

	/* Select children */
	contentRenderer: (props) => <Content {...props} />,
	optionRenderer: (props) => <Option {...props} />,
	inputRenderer: (props) => <Input {...props} />,
	loadingRenderer: (props) => <Loading {...props} />,
	clearRenderer: (props) => <Clear {...props} />,
	separatorRenderer: (props) => <Separator {...props} />,
	dropdownHandleRenderer: (props) => <DropdownHandle {...props} />,

	/* Dropdown */
	dropdownRenderer: (props) => <Dropdown {...props} />,

	/* Dropdown children */
	itemRenderer: (props) => <Item {...props} />,
	noDataRenderer: (props) => <NoData {...props} />,
};

const SelectContainer = styled.div`

	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	direction: ${({ direction }) => direction};
	box-sizing: border-box;
	border: 1px solid #ddd;
	border-radius: 2px;
	background-color: #fafafa;
	width: 100%;
	padding: 2px 5px;
	cursor: pointer;

	:hover,
	:focus,
	:focus-within {
		border-color: #0074d9;
	}

	:focus,
	:focus-within {
		outline: 1px solid #0074d9;
	}

	* {
		box-sizing: border-box;
	}

	&.${LIB_NAME}-disabled {
		cursor: not-allowed;
		opacity: 0.4;
	}
`;

export default Select;
