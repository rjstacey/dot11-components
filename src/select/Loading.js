import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const Loading = ({ props }) => <LoadingComponent className={`${LIB_NAME}-loading`} />;

const LoadingComponent = styled.div`
	@keyframes dual-ring-spin {
		0% {transform: rotate(0deg);}
		100% {transform: rotate(180deg);}
	}

	:after {
		content: ' ';
		display: block;
		width: 1em;
		height: 1em;
		border: 1px solid;
		border-radius: 50%;
		border-color: #0074d9 transparent;
		animation: dual-ring-spin 0.7s ease-in-out infinite;
	}
`;

export default Loading;
