import PropTypes from 'prop-types';
import React from 'react';
import styled from '@emotion/styled';
import {ActionIcon} from '../icons';
import Calendar from '../calendar';
import TextArea from './TextArea';
import Dropdown from '../general/Dropdown';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	border: solid 1px #ddd;
	background-color: #fafafa;
	box-sizing: border-box;
	border-radius: 3px;
	line-height: 25px;
	padding: 0 5px;

	.clear {
		visibility: hidden;
		margin: 0 5px;
	}

	:not([disabled]):hover .clear.active,
	:focus-within .clear.active {
		visibility: visible;
	}

	:focus-within {
		outline: 0;
		box-shadow: 0 0 0 3px rgba(0,116,217,0.2);
	}
	:focus-within,
	:not([disabled]):hover {
		border-color: #0074D9;
	}

	.textarea {
		font-family: inherit;
		border: none;
		resize: none;
	}

	.textarea.invalid {
		color: red;
	}

	.textarea:focus-visible {
		outline: none;
		box-shadow: none;
	}

	.textarea::placeholder {
		font-style: italic;
	}
`;

const toISODate = (d) => '' + d.getFullYear() + '-' + ('0' + (d.getMonth()+1)).substr(-2) + '-' + ('0' + d.getDate()).substr(-2);

function toDatesStr(dates) {
	let currentMonth;
	const list = [];
	for (const date of dates) {
		const m = date.match(/(\d{4})-(\d{2})-(\d{2})/);
		if (m) {
			const month = m[2];
			const day = m[3];
			let s = '' + parseInt(day, 10);
			if (month !== currentMonth) {
				s = months[parseInt(month, 10)-1] + ' ' + s;
				currentMonth = month;
			}
			list.push(s);
		}
	}
	return list.join(', ');
}

function InputDates({
	className,
	style,
	value,
	onChange,
	disabled,
	multi,
	dual,
	disablePast,
	placeholder,
}) {
	const [uncontrolledValue, setUncontrolledValue] = React.useState([]);
	const dates = value || uncontrolledValue;
	const setDates = onChange || setUncontrolledValue;
	const [datesStr, setDatesStr] = React.useState(toDatesStr(dates));
	const [textareaHasFocus, setTextareaHasFocus] = React.useState(false);

	React.useEffect(() => {
		if (!textareaHasFocus) {
			const str = toDatesStr(dates);
			if (str !== datesStr)
				setDatesStr(str);
		}
	}, [textareaHasFocus, dates, datesStr]);

	const {minDate, maxDate} = React.useMemo(() => {
		const today = new Date();
		const minDate = toISODate(new Date(today.getFullYear(), today.getMonth(), 1));
		const maxDate = toISODate(new Date(today.getFullYear() + 1, today.getMonth(), 0));
		return {minDate, maxDate};
	}, []);

	placeholder = placeholder || (multi? 'Month dd, dd, etc.': 'Month dd');

	function changeDatesStr(str) {
		const dates = [];
		const now = new Date();
		let currentMonth = now.getMonth();
		let currentYear = now.getFullYear();
		let strArray = str.split(',');
		if (!multi)
			strArray = strArray.slice(0, 1);
		for (let s of strArray) {
			let date = null;
			s = s.trim();
			const matches = s.match(/([A-Za-z]*)\s*([\d]+)/i);
			if (matches) {
				const monthStr = matches[1];
				const dayStr = matches[2];
				if (monthStr) {
					currentMonth = months.findIndex(m => m.toLowerCase() === monthStr.substr(0,3).toLowerCase());
					if (currentMonth < now.getMonth())
						currentYear = now.getFullYear() + 1;
				}
				if (currentMonth >= 0 && dayStr)
					date = toISODate(new Date(currentYear, currentMonth, dayStr));
			}
			if (date)
				dates.push(date);
		}
		dates.sort();
		setDates(dates);
		setDatesStr(str);
	}

	function changeDatesArray(dates) {
		setDatesStr(toDatesStr(dates));
		setDates(dates);
	}

	return (
		<Wrapper
			className={className}
			style={style}
			disabled={disabled}
		>
			<TextArea
				className={'textarea' + (dates.length === 0? ' invalid': '')}
				value={datesStr}
				onChange={(e) => changeDatesStr(e.target.value)}
				placeholder={placeholder}
				disabled={disabled}
				onFocus={() => setTextareaHasFocus(true)}
				onBlur={() => setTextareaHasFocus(false)}
			/>
			<ActionIcon
				className={'clear' + (datesStr? ' active': '')}
				type='clear'
				onClick={() => changeDatesArray([])}
				disabled={disabled}
			/>
			<Dropdown
				className='calendar'
				selectRenderer={({isOpen, open, close}) =>
					<ActionIcon
						type='calendar'
						title='Select date'
						disabled={disabled} 
						onClick={isOpen? close: open}
					/>
				}
				dropdownRenderer={
					() => <Calendar
						multi={multi}
						dual={dual}
						disablePast={disablePast}
						minDate={minDate}
						maxDate={maxDate}
						value={dates}
						onChange={changeDatesArray}
					/>
				}
			/>
		</Wrapper>
	);
}

function validateISODate(props, propName, componentName) {
  const value = props[propName];
  if (value && /%d{4}-%d{2}-%d{2}/.test(value))
    return new Error(`Invalid prop ${propName} supplied to ${componentName}. Expect string in form 'YYYY-MM-DD'.`);
}

InputDates.propTypes = {
	value: PropTypes.arrayOf(validateISODate),
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	multi: PropTypes.bool,
	dual: PropTypes.bool,
	disablePast: PropTypes.bool,
}

export default InputDates;
