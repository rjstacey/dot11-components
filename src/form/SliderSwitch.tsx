import * as React from "react";
import styles from "./form.module.css";

interface SliderSwitchProps
	extends Omit<
		React.ComponentProps<"input">,
		"type" | "checked" | "value" | "onChange"
	> {
	value: boolean;
	onChange: (value: boolean) => void;
}

const SliderSwitch = ({
	className,
	value,
	onChange,
	...otherProps
}: SliderSwitchProps) => (
	<input
		className={styles["sliderswitch"] + (className ? " " + className : "")}
		type="checkbox"
		checked={value}
		onChange={(e) => onChange(e.target.checked)}
		{...otherProps}
	/>
);

export default SliderSwitch;
