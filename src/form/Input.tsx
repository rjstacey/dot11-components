import * as React from "react";
import styles from "./form.module.css";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, ...props }, ref) => (
		<input
			ref={ref}
			className={styles["input"] + (className ? " " + className : "")}
			{...props}
		/>
	)
);

export default Input;
