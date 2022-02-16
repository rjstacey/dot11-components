import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const Clear = ({ props, state, methods }) => {

	const clear = (event) => {
		event.stopPropagation();
		methods.clearAll();
	}

	return (
		<ClearComponent
			className={`${LIB_NAME}-clear`}
			tabIndex="-1"
			onClick={clear}
		>
			&times;
		</ClearComponent>
	)
}

const ClearComponent = styled.div`
	height: 1em;
	margin: 0 5px;

	:hover {
		color: tomato;
	}
`;

export default Clear;
