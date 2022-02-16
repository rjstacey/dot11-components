import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const NoData = ({ props, state, methods }) =>
	<NoDataComponent
		className={`${LIB_NAME}-no-data`}
	>
		{props.noDataLabel}
	</NoDataComponent>

const NoDataComponent = styled.div`
	padding: 10px;
	text-align: center;
	font-style: italic;
	color: GreyText;
`;

export default NoData;
