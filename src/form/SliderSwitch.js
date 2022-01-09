import PropTypes from 'prop-types';
import styled from '@emotion/styled';

const SliderSwitch = styled.input`
	position: relative;
	display: inline-block;
	width: 2.5em;
	height: 1.5em;
	background-color: #ccc;
	border-radius: 16px;
	transition: .4s;
	appearance: none;

	:before {
		position: absolute;
		content: "";
		height: 1em;
		width: 1em;
		left: 0.25em;
		bottom: 0.25em;
		background-color: white;
		transition: .4s;
		border-radius: 50%;
	}

	:checked {
		background-color: #2196F3;
	}

	:checked:before {
		transform: translateX(1em);
	}

	:focus, :focus-visible {
		outline: none;
	}
`;

SliderSwitch.defaultProps = {
	type: 'checkbox',
}

export default SliderSwitch;
