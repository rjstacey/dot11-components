import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

import Dropdown from './Dropdown';
import Item from './Item';
import MultiSelectItem from './MultiSelectItem';
import SelectItem from './SelectItem';
import Input from './Input';
import DropdownHandle from './DropdownHandle';

import {debounce} from '../lib';

import './index.css';

const Content = (props) => <div className='select-content' {...props} />
const Loading = (props) => <div className='select-loading' {...props} />
const Clear = (props) => <div className='select-clear-all' {...props} />
const Separator = (props) => <div className='select-separator' {...props} />
const Placeholder = (props) => <div className='select-placeholder' {...props} />
const NoData = ({props}) => <div className='select-dropdown-no-data'>{props.noDataLabel}</div>

function defaultContentRenderer({props, state, methods}) {
	const values = props.value;
	if (props.multi) {
		return values.map((item) => {
				const key = '' + item[props.valueField] + item[props.labelField];
				const el = props.multiSelectItemRenderer({item, props, state, methods});
				return {...el, key}
			});
	}
	else if (values.length > 0) {
		const item = values[0];
		return props.selectItemRenderer({item, props, state, methods});
	}
	return null;
}

class Select extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			isOpen: false,
			search: '',
			selectBounds: {},
			cursor: null,
			searchResults: props.options,
		};

		this.methods = {
			open: this.open,
			close: this.close,
			addItem: this.addItem,
			removeItem: this.removeItem,
			setSearch: this.setSearch,
			getInputSize: this.getInputSize,
			isSelected: this.isSelected,
			isDisabled: this.isDisabled,
			sort: this.sort,
			filter: this.filter,
			searchResults: this.searchResults,
		};

		this.selectRef = React.createRef();
		this.inputRef = React.createRef();
		this.dropdownRef = React.createRef();

		this.debouncedUpdateSelectBounds = debounce(this.updateSelectBounds);
		this.debouncedOnScroll = debounce(this.onScroll);
	}

	componentDidUpdate(prevProps, prevState) {
		const {props, state} = this;

		if (prevProps.options !== props.options ||
			prevProps.keepSelectedInList !== props.keepSelectedInList ||
			prevProps.sortBy !== props.sortBy
		) {
			this.setState({
				cursor: null,
				searchResults: this.searchResults()
			});
		}

		if (prevProps.multi !== props.multi ||
			prevProps.value !== props.value ||
			prevState.search !== state.search
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

		// Click in dropdown
		const dropdownEl = this.dropdownRef.current;
		if (dropdownEl && (dropdownEl === target || dropdownEl.contains(target))) {
			// don't take focus from select
			this.selectRef.current.focus();
			return;
		}
		
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
		document.addEventListener('scroll', this.debouncedOnScroll);
		document.addEventListener('click', this.onClick, true);

		this.updateSelectBounds();

		let cursor = null;
		if (!props.multi && props.value.length > 0) {
			// Position cursor on selected value
			const item = props.value[0];
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
		document.removeEventListener('scroll', this.debouncedOnScroll);
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
		const {props} = this;
		let values;
		if (props.multi) {
			values = [...props.value, item];
		}
		else {
			values = [item];
			this.close();
		}

		props.onChange(values);

		if (props.clearOnSelect) {
			this.setState({search: ''},
				() => this.setState({searchResults: this.searchResults()})
			);
		}
	}

	removeItem = (item) => {
		const {props} = this;
		const newValues = props.value.filter((valueItem) => !props.valuesEqual(valueItem, item));
		props.onChange(newValues);
	}

	clearAll = (e) => {
		e.stopPropagation();
		this.props.onChange([]);
	}

	setSearch = (search) => {
		if (search && !this.state.isOpen)
			this.open();
		this.setState({search},
			() => this.setState({
				cursor: 0,
				searchResults: this.searchResults()
			})
		);
	}

	getInputSize = () => {
		const {props, state} = this;
		if (state.search)
			return state.search.length;
		if (props.value.length > 0)
			return props.addPlaceholder.length;
		return props.placeholder.length;
	};

	isSelected = (item) => {
		const {props} = this;
		return !!props.value.find((selectedItem) => props.valuesEqual(selectedItem, item));
	}

	isDisabled = (item) => item.disabled;

	sort = (options) => {
		const {sortBy} = this.props;
		if (!sortBy)
			return options;

		return options
			.sort((a, b) => {
				const a_v = a[sortBy];
				const b_v = b[sortBy];
				if (a_v < b_v)
					return -1;
				else if (a_v > b_v)
					return 1;
				else
					return 0;
			});
	}

	filter = (options) => {
		const {search} = this.state;
		const {searchBy} = this.props;
		const safeString = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const regexp = new RegExp(safeString, 'i');
		return options
			.filter((item) =>
				Array.isArray(searchBy)?
					searchBy.reduce((result, searchBy) => result || regexp.test(item[searchBy]), false):
					regexp.test(item[searchBy])
			);
	}

	searchResults = () => {
		const {props, state, methods} = this;

		let {options} = props;
		if (!props.keepSelectedInList)
			options = options.filter(item => methods.isSelected(item));
		options = methods.filter(options, state);
		options = methods.sort(options, state);
		if (props.create && state.search) {
			const newItem = {
				[props.valueField]: state.search,
				[props.labelField]: state.search
			}
			options = [newItem, ...options];
		}
		return options;
	}

	handleKeyDown = (event) => {
		const {props, state} = this;

		const escape = event.key === 'Escape';
		const enter = event.key === 'Enter';
		const arrowUp = event.key === 'ArrowUp';
		const arrowDown = event.key === 'ArrowDown';
		const backspace = event.key === 'Backspace';
		const tab = event.key === 'Tab' && !event.shiftKey;
		const shiftTab = event.key === 'Tab' && event.shiftKey;

		if (backspace && props.backspaceDelete && !state.search && props.value.length > 0) {
			const item = props.value[props.value.length - 1];
			this.removeItem(item);
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
			const item = state.searchResults[state.cursor];
			if (item && !item.disabled) {
				if (!this.isSelected(item))
					this.addItem(item);
				else
					this.removeItem(item);
			}
		}

		if (arrowDown || arrowUp) {
			let {cursor} = state;
			let wrap = 0;
			let item;
			do {
				if (cursor === null) {
					cursor = 0;
				}
				else {
					if (arrowDown) {
						if (cursor === (state.searchResults.length - 1)) {
							cursor = 0;
							wrap++;
						}
						else 
							cursor += 1;
					}
					else {	// arrowUp
						if (cursor === 0) {
							cursor = state.searchResults.length - 1;
							wrap++;
						}
						else
							cursor -= 1;
					}
				}
				item = state.searchResults[cursor];
			} while (item && item.disabled && wrap < 2)
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
			if (dropdownHeight > window.innerHeight && dropdownHeight > selectBounds.top)
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
				style.bottom = window.innerHeight - selectBounds.top + props.dropdownGap;
		}
		else {
			style.position = 'absolute';
			style.left = -1;
			if (position === 'bottom')
				style.top = selectBounds.height + 2 + props.dropdownGap;
			else
				style.bottom = selectBounds.height + 2 + props.dropdownGap;
		}

		const dropdownEl = props.dropdownRenderer({...dropdownProps, dropdownRef: this.dropdownRef, style, className: props.dropdownClassName});

		return props.portal? ReactDOM.createPortal(dropdownEl, props.portal): dropdownEl;
	}

	render() {
		const {props, state, methods} = this;

		let cn = 'select';
		if (props.readOnly)
			cn += ` select-read-only`;
		if (props.className)
			cn += ` ${props.className}`;

		const onClick = (props.readOnly || props.keepOpen)? undefined: (state.isOpen? this.close: this.open);

		return (
			<div
				ref={this.selectRef}
				style={props.style}
				className={cn}
				tabIndex={props.readOnly ? '-1' : '0'}
				aria-label="Dropdown select"
				aria-expanded={state.isOpen}
				onClick={onClick}
				onFocus={() => !props.readOnly && this.inputRef.current && this.inputRef.current.focus()}
				onKeyDown={this.handleKeyDown}
				direction={props.direction}
			>
				<Content
					style={{minWidth: props.placeholder? `${props.placeholder.length}ch`: undefined}}
				>
					{props.value.length === 0 && !state.search && <Placeholder >{props.placeholder}</Placeholder>}
					{props.contentRenderer({props, state, methods})}
					{props.searchable && !props.readOnly && props.inputRenderer({inputRef: this.inputRef, value: state.search, onChange: methods.setSearch})}
				</Content>

				{props.loading && <Loading />}

				{props.clearable && !props.readOnly && <Clear onClick={this.clearAll} />}

				{props.separator && !props.readOnly && <Separator />}

				{props.dropdownHandle && !props.readOnly && <DropdownHandle isOpen={state.isOpen} />}

				{(state.isOpen || props.keepOpen) && !props.readOnly && this.renderDropdown({props, state, methods})}
			</div>
		)
	}
}

Select.propTypes = {
	value: PropTypes.array.isRequired,
	onChange: PropTypes.func.isRequired,
	options: PropTypes.array.isRequired,
	onDropdownClose: PropTypes.func,
	onDropdownOpen: PropTypes.func,
	placeholder: PropTypes.string,
	addPlaceholder: PropTypes.string,
	loading: PropTypes.bool,
	multi: PropTypes.bool,
	create: PropTypes.bool,
	clearable: PropTypes.bool,
	searchable: PropTypes.bool,
	backspaceDelete: PropTypes.bool,
	readOnly: PropTypes.bool,
	closeOnScroll: PropTypes.bool,
	closeOnSelect: PropTypes.bool,
	closeOnBlur: PropTypes.bool,
	keepOpen: PropTypes.bool,
	keepSelectedInList: PropTypes.bool,
	autoFocus: PropTypes.bool,
	portal: PropTypes.object,

	labelField: PropTypes.string,
	valueField: PropTypes.string,
	searchBy: PropTypes.string,
	sortBy: PropTypes.string,
	valuesEqual: PropTypes.func,

	direction: PropTypes.oneOf(['ltr', 'rtl']),
	dropdownHandle: PropTypes.bool,
	separator: PropTypes.bool,
	noDataLabel: PropTypes.string,
	createNewLabel: PropTypes.string,
	dropdownGap: PropTypes.number,
	dropdownHeight: PropTypes.number,
	dropdownPosition: PropTypes.oneOf(['auto', 'bottom', 'top']),
	estimatedItemHeight: PropTypes.number,

	style: PropTypes.object,
	className: PropTypes.string,
	dropdownClassName: PropTypes.string,

	contentRenderer: PropTypes.func,
	dropdownRenderer: PropTypes.func,
	itemRenderer: PropTypes.func,
	newItemRenderer: PropTypes.func,
	noDataRenderer: PropTypes.func,
	optionRenderer: PropTypes.func,
	inputRenderer: PropTypes.func,
	loadingRenderer: PropTypes.func,
	clearRenderer: PropTypes.func,
	separatorRenderer: PropTypes.func,
	dropdownHandleRenderer: PropTypes.func,
}

Select.defaultProps = {
	onDropdownOpen: () => undefined,
	onDropdownClose: () => undefined,
	placeholder: 'Select...',
	addPlaceholder: '',
	loading: false,
	multi: false,
	create: false,
	clearable: false,
	searchable: true,
	backspaceDelete: true,
	readOnly: false,
	closeOnScroll: false,
	clearOnSelect: true,
	clearOnBlur: true,
	keepOpen: false,
	keepSelectedInList: true,
	autoFocus: false,
	portal: null,

	labelField: 'label',
	valueField: 'value',
	searchBy: 'label',
	sortBy: null,
	valuesEqual: (a, b) => a === b,

	direction: 'ltr',
	dropdownHandle: true,
	separator: false,
	noDataLabel: 'No data',
	createNewLabel: 'add {search}',
	color: '#0074D9',
	dropdownGap: 5,
	dropdownHeight: 300,
	dropdownPosition: 'bottom',
	estimatedItemHeight: 29.6667,

	/* Select children */
	contentRenderer: defaultContentRenderer,
	selectItemRenderer: (props) => <SelectItem {...props} />,
	multiSelectItemRenderer: (props) => <MultiSelectItem {...props} />,
	inputRenderer: (props) => <Input {...props} />,

	/* Dropdown */
	dropdownRenderer: (props) => <Dropdown {...props} />,

	/* Dropdown children */
	itemRenderer: (props) => <Item {...props} />,
	noDataRenderer: (props) => <NoData {...props} />,
};

export default Select;
export {Loading, Clear, Separator, DropdownHandle}
