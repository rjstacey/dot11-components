import * as React from "react";
import styles from "./form.module.css";

const Input = ({
	className,
	...props
}: React.ComponentProps<"input">) => (
	<input
		className={styles["input"] + (className ? " " + className : "")}
		{...props}
	/>
);

export default Input;
