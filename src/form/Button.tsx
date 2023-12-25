import * as React from "react";
import styles from "./form.module.css";

const Button = ({
	className,
	isActive,
	...props
}: {
	isActive?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		className={styles.button + (isActive ? " active" : "")}
		{...props}
	/>
);

export default Button;
