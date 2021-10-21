import PropTypes from 'prop-types'
import React from 'react'
import styled from '@emotion/styled'
import {ActionIcon} from '../icons'
import Calendar from '../calendar'
import TextArea from './TextArea'
import Dropdown from '../general/Dropdown'

const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

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

function toDatesStr(dates) {
	const now = new Date();
	let currentMonth = now.getMonth();
	const list = [];
	for (const date of dates) {
		let s = '';
		const month = Intl.DateTimeFormat('en-US', {month: 'short'}).format(date);
		if (month !== currentMonth) {
			s += month;
			currentMonth = month;
		}
		const day = date.getDate();
		s += ' ' + day;
		list.push(s);
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
	const selectedDates = value || uncontrolledValue;
	const setSelectedDates = onChange || setUncontrolledValue;
	const [datesStr, setDatesStr] = React.useState(toDatesStr(selectedDates));
	const [textareaHasFocus, setTextareaHasFocus] = React.useState(false);

	React.useEffect(() => {
		if (!textareaHasFocus) {
			const str = toDatesStr(selectedDates);
			if (str !== datesStr)
				setDatesStr(str);
		}
	}, [textareaHasFocus, selectedDates, datesStr]);

	const today = new Date();
	const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
	const maxDate = new Date(today.getFullYear() + 1, today.getMonth(), 0);

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
			const matches = s.match(/([a-z]*)\s*([\d]+)/i);
			if (matches) {
				const monthStr = matches[1];
				const dayStr = matches[2];
				if (monthStr) {
					currentMonth = months.indexOf(monthStr.substr(0,3).toLowerCase());
					if (currentMonth < now.getMonth())
						currentYear = now.getFullYear() + 1;
				}
				if (currentMonth >= 0 && dayStr)
					date = new Date(currentYear, currentMonth, dayStr);
			}
			if (date)
				dates.push(date);
		}
		dates.sort((a, b) => a - b);
		setSelectedDates(dates);
		setDatesStr(str);
	}

	function changeDatesArray(dates) {
		dates = dates.slice().sort((a, b) => a - b);
		setDatesStr(toDatesStr(dates));
		setSelectedDates(dates);
	}

	return (
		<Wrapper
			className={className}
			style={style}
			disabled={disabled}
		>
			<TextArea
				className={'textarea' + (selectedDates.length === 0? ' invalid': '')}
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
						value={selectedDates}
						onChange={changeDatesArray}
					/>
				}
			/>
		</Wrapper>
	);
}

InputDates.propTypes = {
	value: PropTypes.array,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	multi: PropTypes.bool,
	dual: PropTypes.bool,
	disablePast: PropTypes.bool,
}

export default InputDates;
