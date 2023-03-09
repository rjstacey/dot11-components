import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

import {Icon} from '../icons';
import {Button} from '../form';

import {debounce} from '../lib';

import './index.css';

const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 1em;
	min-height: 1em;
	cursor: pointer;
	:hover {color: tomato};
`;

export type RendererProps = {
	props: DropdownProps;
	state: DropdownState;
	methods: DropdownMethods;
}

export type DropdownProps = {
	title?: string;
	label?: string;

	onRequestOpen?: Function;
	onRequestClose?: Function;
	disabled?: boolean;
	closeOnScroll?: boolean;
	closeOnBlur?: boolean;
	keepOpen?: boolean;
	portal?: object;

	handle?: boolean;
	dropdownGap?: number;
	dropdownHeight?: number;
	dropdownPosition?: 'auto' | 'bottom' | 'top';
	dropdownAlign?: 'right' | 'left' | 'justify';

	style?: React.CSSProperties;
	className?: string;
	dropdownClassName?: string;

	selectRenderer?: (props: RendererProps) => React.ReactNode;
	dropdownRenderer?: (props: RendererProps) => React.ReactNode;

	children?: React.ReactNode;
}

type DropdownState = {
	isOpen: boolean;
	selectBounds: DOMRect | null;
	dropdownBounds: DOMRect | null;
}

type DropdownMethods = {
	open: () => void;
	close: () => void;
}


function defaultSelectRenderer({props, state, methods}: RendererProps) {
	return (
		<Header
			title={props.title}
			onClick={props.disabled? undefined: (state.isOpen? methods.close: methods.open)}
		>
			{props.label && <label>{props.label}</label>}
			{props.handle && <Icon type='handle' isOpen={state.isOpen} />}
		</Header>
	)
}

function defaultDropdownRenderer({props}: RendererProps) {
	return props.children;
}

const boundsEqual = (b1: DOMRect | null, b2: DOMRect | null) => 
		b1 === b2 ||
		(!!b1 && !!b2 &&
		 b1.x === b2.x &&
		 b1.y === b2.y &&
		 b1.width === b2.width &&
		 b1.height === b2.height);

export class Dropdown extends React.Component<DropdownProps, DropdownState> {
	dropdownRef: any;
	selectRef: any;
	methods: any;
	debouncedUpdateBounds: () => void;
	debouncedOnScroll: () => void;

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			selectBounds: null,
			dropdownBounds: null
		};

		this.methods = {
			open: this.open,
			close: this.close,
		};

		this.selectRef = null;
		this.dropdownRef = null;

		this.debouncedUpdateBounds = debounce(this.updateBounds);
		this.debouncedOnScroll = debounce(this.onScroll);
	}

	componentDidMount() {
		this.updateBounds();
	}

	onOutsideClick = (event: MouseEvent) => {
		const {state} = this;

		// Ignore if not open
		if (!state.isOpen)
			return;

		const {target} = event;

		// Ignore click in dropdown
		const dropdownEl = this.dropdownRef;
		if (dropdownEl && (dropdownEl === target || dropdownEl.contains(target)))
			return;
		
		// Ignore click in select
		const selectEl = this.selectRef;
		if (selectEl && (selectEl === target || selectEl.contains(target)))
			return;

		this.close();
	}

	onScroll = () => {
		if (this.props.closeOnScroll) {
			this.close();
			return;
		}

		this.updateBounds();
	}

	updateBounds = () => {
		//console.log(this.selectRef, this.dropdownRef)
		const selectBounds = this.selectRef?
			this.selectRef.getBoundingClientRect(): {};
		const dropdownBounds = this.dropdownRef?
			this.dropdownRef.getBoundingClientRect(): null;
		if (!boundsEqual(this.state.selectBounds, selectBounds))
			this.setState({selectBounds});
		if (!boundsEqual(this.state.dropdownBounds, dropdownBounds))
			this.setState({dropdownBounds});
	}

	setSelectRef = (ref: HTMLDivElement) => {
		this.selectRef = ref;
		const selectBounds = ref? ref.getBoundingClientRect(): null;
		this.setState({selectBounds});
	}

	setDropdownRef = (ref: HTMLDivElement) => {
		this.dropdownRef = ref;
		const dropdownBounds = ref? ref.getBoundingClientRect(): null;
		this.setState({dropdownBounds});
	}

	open = () => {
		const {props, state} = this;
		if (state.isOpen)
			return;

		window.addEventListener('resize', this.debouncedUpdateBounds);
		document.addEventListener('scroll', this.debouncedOnScroll, true);
		document.addEventListener('click', this.onOutsideClick, true);

		this.updateBounds();

		this.setState({isOpen: true});

		if (props.onRequestOpen)
			props.onRequestOpen();
	}

	close = () => {
		const {props, state} = this;
		if (!state.isOpen)
			return;

		window.removeEventListener('resize', this.debouncedUpdateBounds);
		document.removeEventListener('scroll', this.debouncedOnScroll, true);
		document.removeEventListener('click', this.onOutsideClick, true);

		this.setState({isOpen: false});

		if (props.onRequestClose)
			props.onRequestClose();
	}

	onClick = (event: React.MouseEvent) => {
		const {props, state} = this;

		if (props.disabled || props.keepOpen)
			return;
		event.preventDefault();
		if (state.isOpen)
			this.close();
		else
			this.open();
	}

	onKeyDown = (event: React.KeyboardEvent) => {
		const {state} = this;

		const escape = event.key === 'Escape';
		const enter = event.key === 'Enter';
		const arrowDown = event.key === 'ArrowDown';

		if (state.isOpen && escape)
			this.close();
		if (!state.isOpen && (arrowDown || enter))
			this.open();
	}

	renderDropdown = () => {
		const {props, state, methods} = this;
		const {selectBounds, dropdownBounds} = state;
		const style: React.CSSProperties = {};

		if (!selectBounds)
			return;

		const { 
			dropdownRenderer = defaultDropdownRenderer,
			dropdownPosition = 'bottom',
			dropdownAlign = 'right',
			dropdownGap = 5,
			dropdownHeight = 300
		} = props;

		let className = 'dropdown-container';
		if (props.dropdownClassName)
			className += ` ${props.dropdownClassName}`;

		const dropdownEl = 
			<div
				ref={this.setDropdownRef}
				className={className}
				style={style}
				onClick={e => e.stopPropagation()}	// prevent click propagating to select and closing the dropdown
			>
				{dropdownRenderer({props, state, methods})}
			</div>

		let position = dropdownPosition;
		let align = dropdownAlign;

		// Determine if above or below selector
		if (position === 'auto') {
			const height = selectBounds.bottom + dropdownHeight + dropdownGap;
			if (height > window.innerHeight && height > selectBounds.top)
				position = 'top';
			else
				position = 'bottom';
		}

		if (align === 'justify')
			style.width = selectBounds.width;

		if (props.portal) {
			style.position = 'fixed';
			if (align === 'left') {
				let left = selectBounds.left - 1;
				if (dropdownBounds) {
					const right = left + dropdownBounds.width;
					if (right > window.innerWidth)
						left = window.innerWidth - dropdownBounds.width;
				}
				style.left = left;
			}
			else {
				let right = selectBounds.right + 1;
				if (dropdownBounds) {
					const left = right - dropdownBounds.width;
					if (left < 0)
						right -= left;
				}
				style.right = window.innerWidth - right;
			}
			if (position === 'bottom')
				style.top = selectBounds.bottom + dropdownGap;
			else 
				style.bottom = window.innerHeight - selectBounds.top + dropdownGap;

			return ReactDOM.createPortal(dropdownEl, props.portal);
		}
		else {
			style.position = 'absolute';
			if (align === 'left')
				style.left = -1;
			else
				style.right = 1;
			if (position === 'bottom')
				style.top = selectBounds.height + dropdownGap;
			else
				style.bottom = selectBounds.height + dropdownGap;

			return dropdownEl;
		}
	}

	render() {
		const {props, state, methods} = this;

		const {
			style,
			selectRenderer =  defaultSelectRenderer,
			closeOnBlur,
			disabled,
			keepOpen,
		} = this.props;

		let className = 'dropdown';
		if (props.className)
			className += ` ${props.className}`;

		return (
			<div
				className={className}
				style={style}
				ref={this.setSelectRef}
				onClick={this.onClick}
				onKeyDown={this.onKeyDown}
				onBlur={closeOnBlur? this.close: undefined}
				tabIndex={disabled? -1: 0}
				aria-label="Dropdown"
				aria-expanded={state.isOpen}
			>
				<>
				{selectRenderer({props, state, methods})}
				{(state.isOpen || keepOpen) && this.renderDropdown()}
				</>
			</div>
		)
	}
}

interface ActionButtonDropdownProps extends DropdownProps {
	name?: string;
	label?: string;
	title?: string;
	disabled?: boolean;
};

export const ActionButtonDropdown = ({name, label, title, disabled, ...rest}: ActionButtonDropdownProps) =>
	<Dropdown
		handle={false}
		selectRenderer={({props, state, methods}: RendererProps) =>
			<Button
				title={title}
				disabled={disabled} 
				isActive={state.isOpen}
				onClick={state.isOpen? methods.close: methods.open}
			>
				{label?
					label:
					<Icon
						type={name}
					/>}
			</Button>}
		{...rest}
	/>

export default Dropdown;
