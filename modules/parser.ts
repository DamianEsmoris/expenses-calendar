import { formatDate } from "./date";
const semicolonProps: readonly string[] = ["DTSTART", "DTEND"];

/**
 * Parses a RRULE object into a string to be stored.
 *
 * @param rrule
 * @returns object parsed into a string
 */
function parseRrule(rrule){
	let str = "";
	for (let [key, value] of Object.entries(rrule)){
		if (!value) continue;
		str += `${key}=${value};`;
	}

	return str.slice(0, -1);
}

/**
 * Internal loop to parse an object to a .ics format.
 * 
 * @param obj
 * @returns object parsed into string formatted for a .ics file
 */
function parseLoop(obj){
	if (!obj) return "";
	let str = "";

	for (let [key, value] of Object.entries(obj)) {
		str += (typeof value === "object") ? parseLoop(value) : key + (semicolonProps.includes(key) ? ";" : ":") + value + "\n";
	}

	return str;
}

/**
 * Parses a calendar object into .ics text format.
 * 
 * @param header calendar's header (prodid, vtimezone, etc...)
 * @param body calendar's events
 * @returns final .ics string
 */
function parseCalendar(header, body) {
	const d = new Date();
	header.VTIMEZONE["LAST-MODIFIED"] = formatDate(new Date())
	let str = "";

	str += parseLoop(header);
	body.forEach(c => {
		str += parseLoop(c);
	});
	
	return closeCalendar(str)
}

/**
 * Closes the calendar with the prop END:VCALENAR at the end of the string.
 *
 * @param calendar Calendar formatted in a string
 * @returns Calendar closed.
 */
function closeCalendar(calendar) {
	calendar+="END:VCALENDAR"
	return calendar;
}

export { parseCalendar, parseRrule };
