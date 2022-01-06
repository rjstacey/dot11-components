import React from 'react';
import styled from '@emotion/styled';
import ReactDropdownSelect from 'react-dropdown-select';

const Container = styled.div`
	.react-dropdown-select {
		background-color: #fafafa;
		border: 1px solid #ddd;
		padding: 0 5px;
		min-height: unset;
		box-sizing: border-box;
		:focus-within {
			outline: 0;
			box-shadow: 0 0 0 3px rgba(0,116,217,0.2);
		}
		:focus-within,
		:hover {
			border-color: #0074D9;
		}
	}
	.react-dropdown-select-dropdown {
		z-index: 15;
	}
	.react-dropdown-select {
		opacity: unset;	/* don't change opacity when disabled */
	}
	.react-dropdown-select-content {
		flex-wrap: nowrap;
		line-height: 25px;
		align-items: center;
		overflow: hidden;
	}
	.react-dropdown-select-input {
		font-size: unset;
		&::placeholder {
			font-style: italic;
			color: GreyText;
		}
	}
	.react-dropdown-select-clear {
		margin: 0;
	}
`;

/* Because of the unstyled div wrapper on react-drop-downselect, we need to add another wrapper
 * if we want to style this outer wrapper. Mostly an issue with flex.
 *
 * Stop click propagation because the dropdown might be in another dropdown and a click in the portal
 * closes the parent dropdown.
 */
const Select = ({style, className, readOnly, clearable, dropdownHandle, onChange, ...otherProps}) =>
	<Container
		style={style}
		className={className}
		onClick={e => e.stopPropagation()}
	>
		<ReactDropdownSelect
			clearable={!readOnly && clearable}
			dropdownHandle={!readOnly && dropdownHandle}
			disabled={readOnly}
			onChange={readOnly? () => {}: onChange}
			{...otherProps}
		/>
	</Container>

export default Select;
