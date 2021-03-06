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
	border: 1px solid #adb8c0;

	:before {
		position: absolute;
		content: "";
		height: 1em;
		width: 1em;
		left: 0.25em;
		top: 0.2em;
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

	:focus,
	:focus-visible {
		outline: 0; //1px solid #0074d9;
		border-color: #0074D9;
		box-shadow: 0 0 0 3px rgb(0 116 217 / 20%);
	}
`;

SliderSwitch.defaultProps = {
	type: 'checkbox',
}

export default SliderSwitch;
