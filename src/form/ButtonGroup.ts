import styled from "@emotion/styled";

export default styled.div`
	display: flex;
	align-items: center;
	margin: 0 5px 0 0;
	padding: 3px 8px;
	box-sizing: border-box;
	background: none #fdfdfd;
	background: linear-gradient(to bottom, #fdfdfd 0%, #f6f7f8 100%);
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
		opacity: 0.5;
	}
`;
