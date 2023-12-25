import * as React from "react";
import { Icon } from "../icons";
import Button from "./Button";

const ActionButton = ({
	name,
	label,
	...props
}: { name?: string; label?: string } & React.ComponentProps<typeof Button>) => (
	<Button {...props}>{name ? <Icon type={name} /> : label}</Button>
);

export default ActionButton;
