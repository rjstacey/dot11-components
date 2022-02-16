import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const handlePlaceHolder = (props, state) => {
	const { addPlaceholder, searchable, placeholder } = props;
	const noValues = state.values && state.values.length === 0;
	const hasValues = state.values && state.values.length > 0;

	if (hasValues && addPlaceholder && searchable) {
		return addPlaceholder;
	}

	if (noValues) {
		return placeholder;
	}

	if (hasValues && !searchable) {
		return '';
	}

	return '';
};

function Input({props, state, methods}) {
	const inputRef = React.useRef();

	React.useEffect(() => {
		if (!inputRef.current)
			return;
		if (state.isOpen)
			inputRef.current.focus();
		else
			inputRef.current.blur();
	}, [state.isOpen])

	return (
		<InputComponent
			ref={inputRef}
			tabIndex="-1"
			className={`${LIB_NAME}-input`}
			size={methods.getInputSize()}
			value={state.search}
			onChange={(event) => methods.setSearch(event.target.value)}
			placeholder={handlePlaceHolder(props, state)}
			disabled={props.disabled}
		/>
	);
}

Input.propTypes = {
	props: PropTypes.object,
	state: PropTypes.object,
	methods: PropTypes.object
};

const InputComponent = styled.input`
	line-height: inherit;
	border: none;
	margin-left: 5px;
	background: transparent;
	padding: 0;
	width: calc(${({ size }) => `${size}ch`} + 5px);
	font-size: smaller;
	:focus {
		outline: none;
	}
`;

export default Input;
