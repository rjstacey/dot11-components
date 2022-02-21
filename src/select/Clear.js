import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const Clear = (props) =>
	<ClearComponent
		className={`${LIB_NAME}-clear`}
		{...props}
	>
		&times;
	</ClearComponent>

const ClearComponent = styled.div`
	height: 1em;
	margin: 0 5px;

	:hover {
		color: tomato;
	}
`;

export default Clear;
