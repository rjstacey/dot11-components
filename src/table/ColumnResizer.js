import PropTypes from 'prop-types'
import React from 'react'
import {DraggableCore} from 'react-draggable'
import styled from '@emotion/styled'

const ResizeHandle = styled.div`
	height: 100%;
	width: 12px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	cursor: col-resize;
	color: #0085ff;
	::after {
		content: "⋮";
	}
	:hover,
	.dragging {
		color: #0b6fcc;
		background-color: rgba(0, 0, 0, 0.1)
	}
`;

function ColumnResizer({style, setWidth}) {
	const [drag, setDrag] = React.useState(false)
	const nodeRef = React.useRef(null);
	return (
		<DraggableCore
			axis="x"
			onDrag={(event, {deltaX}) => setWidth(deltaX)}
			onStart={e => setDrag(true)}
			onStop={e => setDrag(false)}
			nodeRef={nodeRef}
		>
			<ResizeHandle
				ref={nodeRef}
				style={style}
				className={drag? 'dragging': undefined}
			/>
		</DraggableCore>
	)
}

ColumnResizer.propTypes = {
	setWidth: PropTypes.func.isRequired
}

export default ColumnResizer;
