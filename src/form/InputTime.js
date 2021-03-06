import PropTypes from 'prop-types';
import React from 'react';
import Input from './Input';

const toTimeStr = (hour, min) => ('0' + hour).substr(-2) + ':' + ('0' + min).substr(-2);

function InputTime({
	style,
	value,
	onChange,
	placeholder,
	...otherProps
}) {
	const [rawValue, setRawValue] = React.useState(value);
	const [valid, setValid] = React.useState(true);
	const [hasFocus, setHasFocus] = React.useState(false);

	React.useEffect(() => {
		if (!hasFocus && value !== rawValue)
			setRawValue(value);
	}, [hasFocus, value, rawValue]);

	placeholder = placeholder || 'HH:MM';

	const handleChange = (e) => {
		const rawValue = e.target.value;
		let isValid = false;
		let value = '';
		const m = rawValue.match(/(\d{1,2}):(\d{2})$/);
		if (m) {
			const hour = parseInt(m[1], 10);
			const min = parseInt(m[2], 10);
			if (hour >= 0 && hour < 24 && min >= 0 && min < 60) {
				isValid = true;
				value = toTimeStr(hour, min);
			}
		}
		else if (rawValue === '') {
			isValid = true;
		}

		setValid(isValid);
		setRawValue(rawValue);

		if (onChange)
			onChange(value);
	}

	const newStyle = {...style, color: valid? 'inherit': 'red'};
	return (
		<Input
			style={newStyle}
			type='search'
			value={rawValue}
			onChange={handleChange}
			placeholder={placeholder}
			onFocus={() => setHasFocus(true)}
			onBlur={() => setHasFocus(false)}
			{...otherProps}
		/>
	)
}

function isValidTime(value) {
	if (value === '')
		return true;
	const m = value.match(/(\d{1,2}):(\d{2})$/);
	if (m) {
		const hour = parseInt(m[1], 10);
		const min = parseInt(m[2], 10);
		if (hour >= 0 && hour < 24 && min >= 0 && min < 60)
			return true;
	}
	return false;
}

function validateTime(props, propName, componentName) {
  const value = props[propName];
  if (value && typeof value === 'string' && !isValidTime(value))
    return new Error(`Invalid prop ${propName} supplied to ${componentName}. Expect empty string or string in form 'HH:MM'.`);
}

InputTime.propTypes = {
	value: validateTime,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
}

export default InputTime;
