/* Format: 2021 May 1 */
export const displayDate = d => {
	const date = (typeof d === 'string')? new Date(d): d;
	if (!(date instanceof Date))
		return '';
	const year = date.getFullYear();
	const month = Intl.DateTimeFormat('en-US', {month: 'short'}).format(date);
	const day = date.getDate();
	return `${year} ${month} ${day}`;
}

/* Format: HH:MM */
export const displayTime = d => {
	const date = (typeof d === 'string')? new Date(d): d;
	if (date instanceof Date)
		return ('0' + date.getHours()).substr(-2) + ':' + ('0' + date.getMinutes()).substr(-2)
	return '';
}

/* Format: Monday */
export const displayDay = d => {
	const date = (typeof d === 'string')? new Date(d): d;
	if (date instanceof Date)
		return new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(date);
	return '';
}

/* Format: Mon, 01-May-2021 */
export const displayDayDate = d => {
	const date = (typeof d === 'string')? new Date(d): d;
	if (date instanceof Date)
		return new Intl.DateTimeFormat('en-US', {weekday: 'short'}).format(date) + ', ' +
			('0' + date.getDate()).substr(-2) + '-' +
			new Intl.DateTimeFormat('en-US', {month: 'short'}).format(date) + '-' +
			date.getFullYear();
	return '';
}

/* Format: "2021 May 5-12" or "2021 May 22-Jun 3" or "2021 Dec 22-2022 Jan 3" */
export const displayDateRange = (d1, d2) => {
	const start = (typeof d1 === 'string')? new Date(d1): d1;
	const end = (typeof d2 === 'string')? new Date(d2): d2;
	if (!(start instanceof Date && end instanceof Date))
		return '';
	const s = {
		year: start.getFullYear(),
		month: Intl.DateTimeFormat('en-US', {month: 'short'}).format(start),
		day: start.getDate()
	};
	const e = {
		year: end.getFullYear(),
		month: Intl.DateTimeFormat('en-US', {month: 'short'}).format(end),
		day: end.getDate()
	}
	if (s.year !== e.year)
		return `${s.year} ${s.month} ${s.day}-${e.year} ${e.month} ${e.day}`;
	if (s.month !== e.month)
		return `${s.year} ${s.month} ${s.day}-${e.month} ${e.day}`;
	return `${s.year} ${s.month} ${s.day}-${e.day}`;
}
