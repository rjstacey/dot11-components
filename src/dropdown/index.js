import PropTypes from 'prop-types';
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

function defaultSelectRenderer({props, state, methods}) {
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

class Dropdown extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			selectBounds: {},
		};

		this.methods = {
			open: this.open,
			close: this.close,
		};

		this.selectRef = React.createRef();
		this.dropdownRef = React.createRef();

		this.debouncedUpdateSelectBounds = debounce(this.updateSelectBounds);
		this.debouncedOnScroll = debounce(this.onScroll);
	}

	componentDidMount() {
		this.updateSelectBounds();
	}

	onOutsideClick = (event) => {
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
		document.addEventListener('scroll', this.debouncedOnScroll, true);
		document.addEventListener('click', this.onOutsideClick, true);

		this.updateSelectBounds();

		this.setState({isOpen: true});

		props.onRequestOpen();
	}

	close = () => {
		const {props, state} = this;
		if (!state.isOpen)
			return;

		window.removeEventListener('resize', this.debouncedUpdateSelectBounds);
		document.removeEventListener('scroll', this.debouncedOnScroll, true);
		document.removeEventListener('click', this.onOutsideClick, true);

		this.setState({isOpen: false});

		props.onRequestClose();
	}

	onClick = (event) => {
		const {props, state} = this;

		if (props.disabled || props.keepOpen)
			return;
		event.preventDefault();
		if (state.isOpen)
			this.close();
		else
			this.open();
	}

	onKeyDown = (event) => {
		const {state} = this;

		const escape = event.key === 'Escape';
		const enter = event.key === 'Enter';
		const arrowDown = event.key === 'ArrowDown';
		const tab = event.key === 'Tab' && !event.shiftKey;
		const shiftTab = event.key === 'Tab' && event.shiftKey;

		if (state.isOpen && escape)
			this.close();
		if (!state.isOpen && (arrowDown || enter))
			this.open();
	}

	renderDropdown = (dropdownProps) => {
		const {props, state, methods} = this;
		const {selectBounds} = state;
		const style = {};

		let className = 'dropdown-container';
		if (props.dropdownClassName)
			className += ` ${props.dropdownClassName}`;

		const dropdownEl = 
			<div
				ref={this.dropdownRef}
				className={className}
				style={style}
				onClick={e => e.stopPropagation()}	// prevent click propagating to select and closing the dropdown
			>
				{props.dropdownRenderer({props, state, methods})}
			</div>

		let position = props.dropdownPosition;
		let align = props.dropdownAlign;

		// Determine if above or below selector
		if (position === 'auto') {
			const dropdownHeight = selectBounds.bottom + parseInt(props.dropdownHeight, 10) + parseInt(props.dropdownGap, 10);
			if (dropdownHeight > window.innerHeight && dropdownHeight > selectBounds.top)
				position = 'top';
			else
				position = 'bottom';
		}

		if (align === 'justify')
			style.width = selectBounds.width;

		if (props.portal) {
			style.position = 'fixed';
			if (align === 'left')
				style.left = selectBounds.left - 1;
			else
				style.right = window.innerWidth - selectBounds.right + 1;
			if (position === 'bottom')
				style.top = selectBounds.bottom + props.dropdownGap;
			else 
				style.bottom = window.innerHeight - selectBounds.top + props.dropdownGap;

			return ReactDOM.createPortal(dropdownEl, props.portal);
		}
		else {
			style.position = 'absolute';
			if (align === 'left')
				style.left = -1;
			else
				style.right = 1;
			if (position === 'bottom')
				style.top = selectBounds.height + props.dropdownGap;
			else
				style.bottom = selectBounds.height + props.dropdownGap;

			return dropdownEl;
		}
	}

	render() {
		const {props, state, methods} = this;

		let className = 'dropdown';
		if (props.className)
			className += ` ${props.className}`;

		return (
			<div
				className={className}
				style={props.style}
				ref={this.selectRef}
				onClick={this.onClick}
				onKeyDown={this.onKeyDown}
				onBlur={props.closeOnBlur? this.close: undefined}
				tabIndex={props.disabled? -1: 0}
				aria-label="Dropdown"
				aria-expanded={state.isOpen}
			>
				{props.selectRenderer({props, state, methods})}
				{(state.isOpen || props.keepOpen) && this.renderDropdown({props, state, methods})}
			</div>
		)
	}
}


Dropdown.propTypes = {
	onRequestOpen: PropTypes.func,
	onRequestClose: PropTypes.func,
	disabled: PropTypes.bool,
	closeOnScroll: PropTypes.bool,
	closeOnBlur: PropTypes.bool,
	keepOpen: PropTypes.bool,
	portal: PropTypes.object,

	handle: PropTypes.bool,
	dropdownGap: PropTypes.number,
	dropdownHeight: PropTypes.number,
	dropdownPosition: PropTypes.oneOf(['auto', 'bottom', 'top']),
	dropdownAlign: PropTypes.oneOf(['right', 'left', 'justify']),

	style: PropTypes.object,
	className: PropTypes.string,
	dropdownClassName: PropTypes.string,

	contentRenderer: PropTypes.func,

	dropdownRenderer: PropTypes.func,
}

Dropdown.defaultProps = {
	onRequestOpen: () => undefined,
	onRequestClose: () => undefined,
	disabled: false,
	closeOnScroll: false,
	clearOnBlur: true,
	keepOpen: false,
	portal: null,

	handle: true,
	dropdownGap: 5,
	dropdownHeight: 300,
	dropdownPosition: 'bottom',
	dropdownAlign: 'right',

	selectRenderer: defaultSelectRenderer,
	dropdownRenderer: ({props}) => props.children,
};

export const ActionButtonDropdown = ({name, label, title, disabled, ...rest}) =>
	<Dropdown
		handle={false}
		selectRenderer={({isOpen, open, close}) =>
			<Button
				title={title}
				disabled={disabled} 
				active={isOpen}
				onClick={isOpen? close: open}
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
