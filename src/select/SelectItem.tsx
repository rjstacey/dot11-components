import React from "react";
import type { SelectItemRendererProps } from ".";

const SelectItem = ({ item, props, state, methods }: SelectItemRendererProps) => (
	<span className="single-item">
		{item[props.labelField]}
	</span>
);

export default SelectItem;
