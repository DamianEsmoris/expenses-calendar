type IcsDateFormat = `${string}T${string}Z`
/**
 * Formats the date in the .ics file's date format.
 *
 * @param date Date type object
 * @returns string YYYYMMDDTHHMMZ
 */
function formatDate(date: Date) : IcsDateFormat {
	let d = date.toISOString().replace(/-|:/g,'')
	return `${d.slice(0,8)}T${d.slice(9,15)}Z`;
}

function getTimezone() {
	const gmtRe = /GMT([\-\+]?\d{4})/;
	const d = new Date().toString();
	const value: RegExpMatchArray | null = gmtRe.exec(d);
	if (value === null) throw new Error("Couldn't get the timezone");
	return value[0]
}

function getTzid(): string {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}


export {
	IcsDateFormat,
	formatDate,
	getTimezone,
	getTzid
}
