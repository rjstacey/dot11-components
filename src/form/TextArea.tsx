import * as React from "react";
import ExpandingTextArea from "react-expanding-textarea";
import styles from "./form.module.css";

const TextArea = ({
	className,
	...props
}: React.ComponentProps<typeof ExpandingTextArea>) => (
	<ExpandingTextArea
		className={styles["textarea"] + (className ? " " + className : "")}
		{...props}
	/>
);

export default TextArea;
