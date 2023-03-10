import React from 'react';
import ReactDOM from 'react-dom';

import {Icon} from '../icons';

import Dropdown from './Dropdown';
import MultiSelectItem from './MultiSelectItem';
import SelectItem from './SelectItem';
import Input from './Input';

import {debounce} from '../lib';

import './index.css';

const Content = (props) => <div className='dropdown-select-content' {...props} />
const Loading = (props) => <div className='dropdown-select-loading' {...props} />
const Clear = (props) => <div className='dropdown-select-clear-all' {...props} />
const Separator = (props) => <div className='dropdown-select-separator' {...props} />
const DropdownHandle = (props) => <Icon className='dropdown-select-handle' type='handle' {...props}/>
const Placeholder = (props) => <div className='dropdown-select-placeholder' {...props} />
const NoData = ({props}) => <div className='dropdown-select-no-data'>{props.noDataLabel}</div>

function defaultContentRenderer({props, state, methods}: RendererProps): React.ReactNode {
	const values = props.values;
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

const defaultAddItemRenderer = ({item, className, props, state, methods}: {item: ItemType, className?: string} & RendererProps): React.ReactNode =>
	<span className={className}>{`Add "${item[props.labelField]}"`}</span>

const defaultItemRenderer = ({item, className, props, state, methods}: {item: ItemType, className?: string} & RendererProps): React.ReactNode =>
	<span className={className}>{item[props.labelField]}</span>

function defaultCreateOption({props, state, methods}: RendererProps): ItemType {
	return {
		[props.valueField]: state.search,
		[props.labelField]: state.search,
	}
}


export type ItemType = any; //{ [key: string]: any} | {};

export type RendererProps = {props: any, state: SelectState, methods: SelectMethods};

export type SelectProps = typeof Select.defaultProps & {
	values: ItemType[];
	onChange: (values: ItemType[]) => void;
	options: ItemType[];

	style?: React.CSSProperties;
	className?: string;
	dropdownClassName?: string;

	portal?: Element | null;

	dropdownWidth?: number;

	/*onRequestClose?: () => void,
	onRequestOpen?: () => void;
	createOption?: (search: string) => any;

	placeholder?: string;
	addPlaceholder?: string;
	loading?: boolean;
	multi?: boolean;
	create?: boolean;
	clearable?: boolean;
	searchable?: boolean;
	backspaceDelete?: boolean;
	readOnly?: boolean;

	closeOnScroll?: boolean;
	closeOnSelect?: boolean;
	closeOnBlur?: boolean;
	clearOnBlur?: boolean;
	keepOpen?: boolean,
	keepSelectedInList?: boolean;
	autoFocus?: boolean;

	labelField?: string;
	valueField?: string;
	searchBy?: string;
	sortBy?: string;
	valuesEqual?: (item1: any, item2: any) => boolean;

	handle?: boolean;
	separator?: boolean;
	noDataLabel?: boolean;

	dropdownGap?: number;
	dropdownHeight?: number;
	dropdownPosition?: 'auto' | 'bottom' | 'top';
	dropdownAlign?: 'left' | 'right';
	dropdownWidth?: number;
	estimatedItemHeight?: number;


	contentRenderer?: (props: RendererProps) => React.ReactNode;
	selectItemRenderer?: (props: {item: any} & RendererProps) => React.ReactNode;
	multiSelectItemRenderer?: (props: {item: any} & RendererProps) => React.ReactNode;
	inputRenderer?: (props: {inputRef: React.RefObject<HTMLInputElement>} & RendererProps) => React.ReactNode;

	dropdownRenderer?: (props: RendererProps) => React.ReactNode;
	itemRenderer?: (props: {item: any, className?: string} & RendererProps) => React.ReactNode;
	noDataRenderer?: (props: SelectProps) => React.ReactNode;*/
};

export type SelectState = {
	isOpen: boolean;
	search: string;
	selectBounds: DOMRect | {};
	cursor: number | null;
	searchResults: ItemType[];
}

export type SelectMethods = {
	open: () => void;
	close: () => void;
	addItem: (item: any) => void;
	addSearchItem: () => Promise<void>;
	removeItem: (item: any) => void;
	setSearch: (search: string) => void;
	getInputSize: () => number;
	isSelected: (item: any) => boolean;
	isDisabled: (item: any) => boolean;
	sort: (options: any) => any;
	filter: (options: any) => any;
	searchResults: () => ItemType[];
};

class Select extends React.Component<SelectProps, SelectState> {

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
			addSearchItem: this.addSearchItem,
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

	state: SelectState;
	private methods: SelectMethods;
	private selectRef: React.RefObject<HTMLDivElement>;
	private inputRef: React.RefObject<HTMLInputElement>;
	private dropdownRef: React.RefObject<HTMLDivElement>;

	private debouncedUpdateSelectBounds: () => void;
	private debouncedOnScroll: () => void;

	componentDidMount() {
		this.updateSelectBounds();
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
			prevProps.values !== props.values ||
			prevState.search !== state.search
		) {
			this.updateSelectBounds();
		}
	}

	onOutsideClick = (event: MouseEvent) => {
		const {state} = this;

		// Ignore if not open
		if (!state.isOpen)
			return;

		const {target} = event;
		if (!(target instanceof Element))
			return;

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
		document.addEventListener('scroll', this.debouncedOnScroll, true);
		document.addEventListener('click', this.onOutsideClick, true);

		this.updateSelectBounds();

		let cursor: number | null = null;
		if (!props.multi && props.values.length > 0) {
			// Position cursor on selected value
			const item = props.values[0];
			cursor = state.searchResults.findIndex(o => props.valuesEqual(item, o));
			if (cursor < 0)
				cursor = null;
		}
		this.setState({isOpen: true, cursor});

		if (props.onRequestOpen)
			props.onRequestOpen();
	}

	close = () => {
		const {props, state} = this;
		if (!state.isOpen)
			return;

		window.removeEventListener('resize', this.debouncedUpdateSelectBounds);
		document.removeEventListener('scroll', this.debouncedOnScroll, true);
		document.removeEventListener('click', this.onOutsideClick, true);

		this.setState({
			isOpen: false,
			search: props.clearOnBlur ? '' : state.search,
			searchResults: props.options,
			cursor: null
		});

		if (props.onRequestClose)
			props.onRequestClose();
	}

	addItem = (item: ItemType) => {
		const {props} = this;
		let values;
		if (props.multi) {
			values = [...props.values, item];
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

	addSearchItem = async () => {
		const {props, state, methods} = this;
		const item = await props.createOption({props, state, methods});
		this.addItem(item);
	}

	removeItem = (item: ItemType) => {
		const {props} = this;
		const newValues = props.values.filter((valueItem) => !props.valuesEqual(valueItem, item));
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
		if (props.values.length > 0)
			return props.addPlaceholder.length;
		return props.placeholder.length;
	};

	isSelected = (item: any) => {
		const {props} = this;
		return !!props.values.find((selectedItem) => props.valuesEqual(selectedItem, item));
	}

	isDisabled = (item: any) => item.disabled || false;

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
		const searchBy = this.props.searchBy || this.props.labelField;
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
		options = methods.filter(options);
		options = methods.sort(options);
		if (props.create && state.search) {
			const newItem = {
				[props.valueField]: state.search,
				[props.labelField]: state.search
			}
			options = [newItem, ...options];
		}
		return options;
	}

	onClick = (event) => {
		const {props, state} = this;
		if (props.readOnly || props.keepOpen)
			return;
		event.preventDefault();
		if (state.isOpen)
			this.close();
		else
			this.open();
	}

	onFocus = (event: React.FocusEvent) => {
		if (this.inputRef.current && document.activeElement !== this.inputRef.current)
			this.inputRef.current.focus();
	}

	onKeyDown = (event: React.KeyboardEvent) => {
		const {props, state} = this;

		const escape = event.key === 'Escape';
		const enter = event.key === 'Enter';
		const arrowUp = event.key === 'ArrowUp';
		const arrowDown = event.key === 'ArrowDown';
		const backspace = event.key === 'Backspace';

		if (backspace && props.backspaceDelete && !state.search && props.values.length > 0) {
			const item = props.values[props.values.length - 1];
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
		if (escape) {
			this.close();
		}

		if (enter) {
			const item = state.searchResults[state.cursor || 0];
			if (item && !item.disabled) {
				if (!this.isSelected(item))
					this.addItem(item);
				else
					this.removeItem(item);
			}
			event.preventDefault();
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
		const {props, state, methods} = this;
		const selectBounds = state.selectBounds as DOMRect;
		const style: Partial<React.CSSProperties> = {width: props.dropdownWidth || selectBounds.width};

		let className = 'dropdown-select-dropdown';
		if (props.dropdownClassName)
			className += ` ${props.dropdownClassName}`;

		const dropdownRenderer = props.dropdownRenderer || ((props: RendererProps) => <Dropdown {...props} />);

		const dropdownEl = 
			<div
				ref={this.dropdownRef}
				className={className}
				style={style}
				onClick={e => e.stopPropagation()}	// prevent click propagating to select and closing the dropdown
			>
				{dropdownRenderer({props, state, methods})}
			</div>

		// Determine if above or below selector
		let position = props.dropdownPosition || 'bottom';
		let align = props.dropdownAlign || 'left';
		let height = props.dropdownHeight || 300;
		let gap = props.dropdownGap || 5;
		if (position === 'auto') {
			const dropdownHeight = selectBounds.bottom + height + gap;
			if (dropdownHeight > window.innerHeight && dropdownHeight > selectBounds.top)
				position = 'top';
			else
				position = 'bottom';
		}

		if (props.portal) {
			style.position = 'fixed';
			if (align === 'left')
				style.left = selectBounds.left - 1;
			else
				style.right = selectBounds.right - 1;
			if (position === 'bottom')
				style.top = selectBounds.bottom + gap;
			else 
				style.bottom = window.innerHeight - selectBounds.top + gap;

			return ReactDOM.createPortal(dropdownEl, props.portal);
		}
		else {
			style.position = 'absolute';
			if (align === 'left')
				style.left = -1;
			else
				style.right = -1;
			if (position === 'bottom')
				style.top = selectBounds.height + 2 + gap;
			else
				style.bottom = selectBounds.height + 2 + gap;

			return dropdownEl;
		}
	}

	render() {
		const {props, state, methods} = this;

		let cn = 'dropdown-select';
		if (props.readOnly)
			cn += ` dropdown-select-read-only`;
		if (props.className)
			cn += ` ${props.className}`;

		return (
			<div
				ref={this.selectRef}
				style={props.style}
				className={cn}
				tabIndex={props.readOnly? -1: 0}
				aria-label="Dropdown select"
				aria-expanded={state.isOpen}
				onClick={this.onClick}
				onKeyDown={this.onKeyDown}
				onFocus={this.onFocus}
				onBlur={props.closeOnBlur? this.close: undefined}
				//direction={props.direction}
			>	
				<Content
					style={{minWidth: `${props.placeholder.length}ch`}}
				>
					{props.values.length === 0 && !state.search && <Placeholder >{props.placeholder}</Placeholder>}
					{props.contentRenderer({props, state, methods})}
					{props.searchable && !props.readOnly &&
						props.inputRenderer({inputRef: this.inputRef, props, state, methods})}
				</Content>

				{props.loading && <Loading />}

				{props.clearable && !props.readOnly && <Clear onClick={this.clearAll} />}

				{props.separator && !props.readOnly && <Separator />}

				{props.handle && !props.readOnly && <DropdownHandle isOpen={state.isOpen} />}

				{(state.isOpen || props.keepOpen) && !props.readOnly && this.renderDropdown({props, state, methods})}
			</div>
		)
	}

	static defaultProps = {
		onRequestOpen: () => undefined,
		onRequestClose: () => undefined,
		createOption: defaultCreateOption,
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
		closeOnBlur: false,
		clearOnSelect: true,
		clearOnBlur: true,
		keepOpen: false,
		keepSelectedInList: true,
		autoFocus: false,
	
		labelField: 'label',
		valueField: 'value',
		searchBy: null,
		sortBy: null,
		valuesEqual: (a: ItemType, b: ItemType) => a === b,
	
		handle: true,
		separator: false,
		noDataLabel: 'No data',
		dropdownGap: 5,
		dropdownHeight: 300,
		dropdownPosition: 'bottom',
		dropdownAlign: 'left',
		estimatedItemHeight: 29.6667,
	
		/* Select children */
		contentRenderer: defaultContentRenderer,
	
		/* Content children */
		selectItemRenderer: (props: {item: ItemType} & RendererProps): React.ReactNode => <SelectItem {...props} />,
		multiSelectItemRenderer: (props: {item: ItemType} & RendererProps): React.ReactNode => <MultiSelectItem {...props} />,
		inputRenderer: (props: {inputRef: React.RefObject<HTMLInputElement>} & RendererProps): React.ReactNode => <Input {...props} />,
	
		/* Dropdown */
		dropdownRenderer: (props: RendererProps): React.ReactNode => <Dropdown {...props} />,
	
		/* Dropdown children */
		addItemRenderer: defaultAddItemRenderer,
		itemRenderer: defaultItemRenderer,
		noDataRenderer: (props) => <NoData {...props} />,
	};
}

export default Select;
