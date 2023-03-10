import React from 'react';
import {DraggableCore, DraggableEventHandler} from 'react-draggable';
import styled from '@emotion/styled';

const ResizeHandle = styled.div`
	height: 100%;
	width: 10px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: col-resize;
	color: #0085ff;
	::after {
		content: "⋮";
	}
	:hover {
		color: #0b6fcc;
		background-color: rgba(0, 0, 0, 0.1)
	}
`;

type ColumnResizerProps = {
	style?: React.CSSProperties;
	onDrag: DraggableEventHandler;
}

function ColumnResizer({style, onDrag}: ColumnResizerProps) {
	const nodeRef = React.useRef(null);
	const [drag, setDrag] = React.useState(false);
	if (drag)
		style = {...style, backgroundColor: 'rgba(0, 0, 0, 0.1)'}

	return (
		<DraggableCore
			//axis="x"
			onDrag={onDrag}
			onStart={e => setDrag(true)}
			onStop={e => setDrag(false)}
			handle='.column-resizer-handle'
			nodeRef={nodeRef}
		>
			<ResizeHandle
				ref={nodeRef}
				style={style}
				className={'column-resizer-handle '}
			/>
		</DraggableCore>
	)
}

export default ColumnResizer;
