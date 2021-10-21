import PropTypes from 'prop-types'
import React from 'react'
import Input from './Input'
import {parseNumber} from '../lib'

function toTimeStr(time) {
	if (!time)
		return '';
	return ('0' + time.HH).substr(-2) + ':' + ('0' + time.MM).substr(-2);
}

function InputTime({
	style,
	value,
	onChange,
	placeholder,
	...otherProps
}) {
	const [valueAsStr, setValueAsStr] = React.useState(toTimeStr(value));
	const [valid, setValid] = React.useState(true);
	const [hasFocus, setHasFocus] = React.useState(false);

	React.useEffect(() => {
		if (!hasFocus) {
			const str = toTimeStr(value);
			if (str !== valueAsStr)
				setValueAsStr(str);
		}
	}, [hasFocus, value, valueAsStr]);

	placeholder = placeholder || 'HH:MM';

	const handleChange = (e) => {
		const {value} = e.target;
		const [hourStr, minStr] = value.split(':');

		let isValid = false;
		let time = null;
		if (hourStr && minStr) {
			time = {
				HH: parseNumber(hourStr),
				MM: parseNumber(minStr)
			};
			if (time.HH >= 0 && time.HH < 24 && time.MM >= 0 && time.MM < 60)
				isValid = true;
		}
		else if (!hourStr && !minStr) {
			isValid = true;
		}

		setValid(isValid);
		setValueAsStr(value);

		if (onChange)
			onChange(isValid? time: null);
	}

	const newStyle = {...style, color: valid? 'inherit': 'red'};
	return (
		<Input
			style={newStyle}
			type='search'
			value={valueAsStr}
			onChange={handleChange}
			placeholder={placeholder}
			onFocus={() => setHasFocus(true)}
			onBlur={() => setHasFocus(false)}
			{...otherProps}
		/>
	)
}

InputTime.propTypes = {
	value: PropTypes.object,
	onChange: PropTypes.func,
	placeholder: PropTypes.string,
}

export default InputTime;
