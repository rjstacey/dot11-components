import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const Separator = () => <SeparatorComponent className={`${LIB_NAME}-separator`} />;

const SeparatorComponent = styled.div`
	display: block;
	border-left: 1px solid #ccc;
	width: 1px;
	height: 1.5em;
	margin: 0 5px;
`;

export default Separator;
