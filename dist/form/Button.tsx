import styled from '@emotion/styled';

type ButtonProps = {
	isActive?: boolean;
}

export default styled.button<ButtonProps>`
	display: inline-block;
	margin: 0 5px;
	padding: 3px;
	box-sizing: border-box;
	background: none ${({isActive}) => isActive? '#d8d8d8': '#fdfdfd'};
	/*background: linear-gradient(to bottom, #fdfdfd 0%,#f6f7f8 100%);*/
	border: 1px solid #999;
	border-radius: 2px;
	color: #333;
	text-decoration: none;
	font-size: inherit;
	font-family: inherit;
	cursor: pointer;
	:disabled {
		cursor: inherit;
		background: none transparent;
		opacity: .5;
	}
	:focus {
		outline: none;
	}
`;
