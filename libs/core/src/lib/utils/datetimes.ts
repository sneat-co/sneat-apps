export function isoStringsToDate(date: string, time?: string): Date {
	const [year, month, day] = date ? date.split('T')[0].split('-') : [0, 0, 0];
	if (time) {
		if (time.includes('T')) {
			time = time.split('T')[1];
		}
	} else {
		time = '00:00';
	}
	const [hour, minute] = time.split(':');
	return new Date(
		Number(year),
		Number(month) - 1,
		Number(day),
		Number(hour),
		Number(minute),
	);
}

export function isValidaTimeString(v?: string): boolean {
	return !!v?.match(/^\d{2}:\d{2}$/);
}

export function isValidDateString(v?: string): boolean {
	return !!v?.match(/^\d{4}-\d{2}-\d{2}$/);
}

export function dateToIso(d: Date): string {
	d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	return d.toISOString().split('T')[0];
}

export function localDateToIso(d: Date): string {
	const month = `${d.getMonth() + 1}`;
	const day = `${d.getDate()}`;
	return `${d.getFullYear()}-${month.length === 1 ? `0${month}` : month}-${
		day.length === 1 ? `0${day}` : day
	}`;
}

export function getWeekdayDate(d: Date, day: number): Date {
	d = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const dateDay = d.getDay();
	const diff = d.getDate() - dateDay + day + (dateDay === 0 ? -6 : 0) + 1; // adjust when day is sunday
	return new Date(d.setDate(diff));
}

export function getWeekID(d: Date): number {
	d = getWeekdayDate(d, 1);
	return (d.getFullYear() * 100 + (1 + d.getMonth())) * 100 + d.getDate();
}
