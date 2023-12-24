import React from "react";
import { DraggableCore, DraggableEventHandler } from "react-draggable";

export type ColumnResizerProps = {
	style?: React.CSSProperties;
	onDrag: DraggableEventHandler;
};

export type { DraggableEventHandler };

export function ColumnResizer({ style, onDrag }: ColumnResizerProps) {
	const nodeRef = React.useRef<HTMLDivElement>(null);
	const [drag, setDrag] = React.useState(false);
	if (drag) style = { ...style, backgroundColor: "rgba(0, 0, 0, 0.1)" };

	const className = "column-resizer-handle";

	return (
		<DraggableCore
			onDrag={onDrag}
			onStart={(e) => setDrag(true)}
			onStop={(e) => setDrag(false)}
			handle={"." + className}
			nodeRef={nodeRef}
		>
			<div
				ref={nodeRef}
				style={style}
				className={className}
			/>
		</DraggableCore>
	);
}

export default ColumnResizer;
