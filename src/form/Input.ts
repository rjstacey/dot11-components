import styled from "@emotion/styled";

const Input = styled.input`
	display: inline-block;
	cursor: inherit;
	-webkit-appearance: none;
	background-color: #fafafa;
	border: 1px solid #ddd;
	box-sizing: border-box;

	:focus {
		outline: 0;
		box-shadow: 0 0 0 3px rgba(0, 116, 217, 0.2);
	}
	:focus,
	:not([disabled]):valid:hover {
		border-color: #0074d9;
	}
	:invalid {
		background-color: #ff000052;
	}
	::placeholder {
		font-style: italic;
	}

	&[type="text"],
	&[type="search"],
	&[type="date"] {
		border-radius: 3px;
		line-height: 25px;
		padding: 0 5px;
	}

	&[type="checkbox"] {
		padding: 6px;
		width: 14px;
		height: 14px;
		position: relative;
		:checked {
			background-color: #e9ecee;
			border: 1px solid #adb8c0;
		}
		:indeterminate {
			background-color: #e9ecee;
			border: 1px solid #adb8c0;
		}
		:checked:after {
			content: "\\2714";
			font-size: 10px;
			font-weight: 700;
			position: absolute;
			top: -1px;
			left: 1px;
		}
		:indeterminate:after {
			content: "";
			position: absolute;
			top: 1px;
			left: 1px;
			border: 5px solid #5f6061;
		}
	}
`;

export default Input;
