import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import styled from '@emotion/styled';

import {useClickOutside} from '../lib';
import {Button, Icon} from '../icons';

/***
 * There is potentially an issue here. If the dropdown opens and causes a scrollbar to appear in the parent due to
 * overflow, then the dropdown will close again on scroll event. In effect, the user will not see the dropdown
 * appear.
 */

const Header = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 1em;
	min-height: 1em;
	cursor: pointer;
	:hover {color: tomato};
`;

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	user-select: none;
	position: relative;
`;

const StyledDropdownContainer = styled.div`
	position: absolute;
	padding: 10px;
	display: flex;
	flex-direction: column;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 5px;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	z-index: 9;
	overflow: auto;
	box-sizing: border-box;
	:focus {outline: none}
`;

function DropdownContainer({
	style, 
	alignLeft,
	portal,
	wrapperEl,
	anchorEl,
	...rest
}) {
	const ref = React.useRef();
	const [position, setPosition] = React.useState(initPosition);

	function initPosition() {
		const wBounds = wrapperEl.getBoundingClientRect();
		let top = wBounds.height + 2, left = 0, right = 0;
		if (anchorEl) {
			const aBounds = anchorEl.getBoundingClientRect();
			top += wBounds.y - aBounds.y;
			left = wBounds.left - aBounds.left;
			right = aBounds.right - wBounds.right;
		}
		return alignLeft? {top, left}: {top, right};
	}

	React.useLayoutEffect(() => {
		// Adjust position if off screen
		const bounds = ref.current.getBoundingClientRect();
		if (!alignLeft) {
			if (bounds.left < 0)
				setPosition(position => ({...position, right: position.right + bounds.left}));
		}
		else {
			if (bounds.right > window.innerWidth)
				setPosition(position => ({...position, left: position.left - (bounds.right - window.innerWidth)}));
		}
	}, [alignLeft]);

	const dropdownEl = <StyledDropdownContainer ref={ref} style={{...style, ...position}} {...rest} />

	//console.log(anchorEl? 'portal': 'local', dropdownEl, anchorEl);

	return portal? ReactDOM.createPortal(dropdownEl, anchorEl): dropdownEl;
}

function Dropdown({
	style,
	className,
	label,
	title,
	disabled,
	children,
	alignLeft,
	portal,
	anchorEl,
	selectRenderer,
	dropdownRenderer,
	onRequestOpen,
	onRequestClose
}) {
	const [isOpen, setOpen] = React.useState(false);
	const wrapperRef = React.useRef(null);
	const anchorElement = portal? anchorEl: wrapperRef.current;

	const open = () => {
		if (disabled)
			return;
		if (onRequestOpen)
			onRequestOpen();
		setOpen(true);
	}

	const close = () => {
		if (onRequestClose)
			onRequestClose();
		setOpen(false);
	}

	const outsideClick = (e) => {
		// ignore if not open or if event target is an element inside the dropdown
		if (!isOpen)
			return;
		if (anchorElement && anchorElement.lastChild.contains(e.target))
			return;
 		close();
	}

	useClickOutside(wrapperRef, outsideClick);

	return (
		<Wrapper
			className={className}
			style={style}
			ref={wrapperRef}
		>
			{selectRenderer({isOpen, open, close, label, title, disabled})}
			{isOpen && anchorElement &&
				<DropdownContainer
					className='dropdown-container'
					portal={portal}
					anchorEl={anchorElement}
					wrapperEl={wrapperRef.current}
					alignLeft={alignLeft}
				>
					{dropdownRenderer({isOpen, close, children})}
				</DropdownContainer>}
		</Wrapper>
	)
}

Dropdown.propTypes = {
	label: PropTypes.string,
	title: PropTypes.string,
	alignLeft: PropTypes.bool.isRequired,
	portal: PropTypes.bool.isRequired,
	onRequestOpen: PropTypes.func,
	onRequestClose: PropTypes.func,
	anchorEl: PropTypes.oneOfType([PropTypes.element, PropTypes.object]),
	selectRenderer: PropTypes.func,
	dropdownRenderer: PropTypes.func,
}

Dropdown.defaultProps = {
	alignLeft: false,
	portal: false,
	selectRenderer: ({isOpen, open, close, label, title, disabled}) =>
		<Header
			title={title}
			onClick={disabled? undefined: (isOpen? close: open)}
		>
			{label && <label>{label}</label>}
			<Icon type='handle' />
		</Header>,
	dropdownRenderer: ({isOpen, close, children}) =>
		React.Children.map(children,
			child => React.isValidElement(child)? React.cloneElement(child, {isOpen, close}): child
		)
}

export const ActionButtonDropdown = ({name, label, title, disabled, ...rest}) =>
	<Dropdown
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
