import React from "react";

import { availableIcons, Icon, ActionIcon } from "../icons";

const story = {
	title: "Icon",
	component: Icon,
	args: {
		disabled: false,
	},
};

export const AvailableIcons = (args: {disabled: boolean}) => (
	<div style={{ display: "flex", flexDirection: "column" }}>
		{availableIcons.map((type) => (
			<div key={type} style={{ display: "flex" }}>
				<div style={{ width: 250 }}>{type}:</div>
				<div style={{width: 50}}>
					<Icon type={type} />
				</div>
				<div>
					<ActionIcon type={type} disabled={args.disabled} />
				</div>
			</div>
		))}
	</div>
);

export default story;
