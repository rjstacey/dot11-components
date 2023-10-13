import PropTypes from "prop-types";
import React from "react";
import Input from "./Input";

const toTimeStr = (hour: number, min: number) =>
	("0" + hour).slice(-2) + ":" + ("0" + min).slice(-2);

interface InputTimeProps
	extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
	style?: React.CSSProperties;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

function InputTime({
	style,
	value,
	onChange,
	placeholder,
	...otherProps
}: InputTimeProps) {
	const [rawValue, setRawValue] = React.useState(value);
	const [valid, setValid] = React.useState(true);
	const [hasFocus, setHasFocus] = React.useState(false);

	React.useEffect(() => {
		if (!hasFocus && value !== rawValue) setRawValue(value);
	}, [hasFocus, value, rawValue]);

	placeholder = placeholder || "HH:MM";

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		let isValid = false;
		let value = "";
		const rx = /(\d{1,2}):(\d{2})$/;
		const m = rx.exec(rawValue);
		if (m) {
			const hour = parseInt(m[1], 10);
			const min = parseInt(m[2], 10);
			if (hour >= 0 && hour < 24 && min >= 0 && min < 60) {
				isValid = true;
				value = toTimeStr(hour, min);
			}
		} else if (rawValue === "") {
			isValid = true;
		}

		setValid(isValid);
		setRawValue(rawValue);

		if (onChange) onChange(value);
	};

	const newStyle = { ...style, color: valid ? "inherit" : "red" };
	return (
		<Input
			style={newStyle}
			type="search"
			value={rawValue}
			onChange={handleChange}
			placeholder={placeholder}
			onFocus={() => setHasFocus(true)}
			onBlur={() => setHasFocus(false)}
			{...otherProps}
		/>
	);
}

function isValidTime(value: string) {
	if (value === "") return true;
	const rx = /(\d{1,2}):(\d{2})$/;
	const m = rx.exec(value);
	if (m) {
		const hour = parseInt(m[1], 10);
		const min = parseInt(m[2], 10);
		if (hour >= 0 && hour < 24 && min >= 0 && min < 60) return true;
	}
	return false;
}

function validateTime(props: object, propName: string, componentName: string) {
	const value = props[propName];
	if (value && typeof value === "string" && !isValidTime(value))
		return new Error(
			`Invalid prop ${propName} supplied to ${componentName}. Expect empty string or string in form 'HH:MM'.`
		);
}

InputTime.propTypes = {
	value: validateTime,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
};

export default InputTime;
