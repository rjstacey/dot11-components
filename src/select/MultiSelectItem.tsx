import React from "react";
import type { SelectItemRendererProps } from ".";

const Clear = (props: React.ComponentProps<"div">) => <div {...props} />;

const MultiSelectItem = ({
	item,
	props,
	state,
	methods,
}: SelectItemRendererProps) => {
	const remove = (event: React.MouseEvent) => {
		event.stopPropagation();
		methods.removeItem(item);
	};

	return (
		<div
			role="listitem"
			//direction={props.direction}
			className="dropdown-select-multi-item"
		>
			<span className="dropdown-select-multi-item-label">
				{item[props.labelField]}
			</span>
			{!props.readOnly && (
				<Clear
					className="dropdown-select-multi-item-remove"
					onClick={remove}
				/>
			)}
		</div>
	);
};

export default MultiSelectItem;
