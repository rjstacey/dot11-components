import styled from '@emotion/styled'
import ExpandingTextArea from 'react-expanding-textarea'

const TextArea = styled(ExpandingTextArea)`
	font-family: inherit;
	font-size: unset;
	background-color: #fafafa;
	border: 1px solid #ddd;
	border-radius: 3px;
	line-height: 25px;
	:focus {
		outline: 0;
		box-shadow: 0 0 0 3px rgba(0,116,217,0.2);
	}
	:focus,
	:hover:not([disabled]) {
		border-color: #0074D9;
	}
`;

export default TextArea;
