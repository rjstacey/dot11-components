import React from 'react';
import styled from '@emotion/styled';
import { LIB_NAME } from './constants';

const DropdownHandle = ({ props, state, methods }) => {
	const style = {};
	if (!state.isOpen)
		style.transform = 'rotate(180deg)';

	return (
		<DropdownHandleComponent
			tabIndex="-1"
			className={`${LIB_NAME}-dropdown-handle`}
			isOpen={state.isOpen}
		>
			<svg style={style} fill="currentColor" viewBox="0 0 40 40">
				<path d="M31 26.4q0 .3-.2.5l-1.1 1.2q-.3.2-.6.2t-.5-.2l-8.7-8.8-8.8 8.8q-.2.2-.5.2t-.5-.2l-1.2-1.2q-.2-.2-.2-.5t.2-.5l10.4-10.4q.3-.2.6-.2t.5.2l10.4 10.4q.2.2.2.5z" />
			</svg>
		</DropdownHandleComponent>
	)
}

const DropdownHandleComponent = styled.div`
	display: flex;
	align-content: center;

	svg {
		width: 1em;
		height: 1em;
	}

	:hover {
		color: tomato;
	}
`;

export default DropdownHandle;
