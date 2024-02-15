import { formatDate } from "./date";
import { VCALENDAR } from "./calendar";
import { Rrule, VEVENT } from "./event";
const semicolonProps: readonly string[] = ["DTSTART", "DTEND"];

/**
 * Parses the Date object of the props: DTSTAMP, DTSTART, DTEND into a string to be stored.
 *
 * @param event Event object with the dates as object
 * @param calendar Calendar of the event, to extract the TZID
 */
function parseDates(event: VEVENT, calendar: VCALENDAR) {
	const tzid: string = calendar.VTIMEZONE.TZID;
	for (let prop of ["DTSTAMP", "DTSTART", "DTEND"]){
		if (typeof event[prop] != "object")
			throw new Error(`Cannot parse the ${prop} of the event: ${event.SUMMARY}`);
		event[prop] = `TZID=${tzid}:${formatDate(event[prop])}`;
	}
}

/**
 * Parses a RRULE object into a string to be stored.
 *
 * @param rrule
 * @returns object parsed into a string
 */
function parseRrule(rrule: Rrule){
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
function parseLoop(obj: Object){
	if (!obj) return "";
	let str = "";

	for (let [key, value] of Object.entries(obj)) {
		if (key === "RRULE") value = parseRrule(<Rrule>obj);
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
function parseCalendar(header: VCALENDAR, body: VEVENT[]) {
	header.VTIMEZONE["LAST-MODIFIED"] = formatDate(new Date())
	let str = "";

	str += parseLoop(header);
	body.forEach(c => {
		parseDates(c, header);
		str += parseLoop(c);
	});
	
	return closeCalendar(str)
}

/**
 * Closes the calendar with the prop END:VCALENAR at the end of the string.
 *
 * @param calendar Calendar formatted in a string
 * @returns calendar closed
 */
function closeCalendar(calendar: string) {
	calendar+="END:VCALENDAR"
	return calendar;
}

/**
 * Parses an ics file event.
 * 
 * @param the lines of the event
 * @returns the event object
 */
function parseIcsEvent(eventLines: string[]): VEVENT {
    const event: Object = {};
    for (const line of eventLines) {
        const [key, value] = line.split(semicolonProps.find(prop => line.includes(prop)) ? ';' : ':');
        event[key] = value;
    }
    return <VEVENT>event;
}


export { 
	semicolonProps,
	parseCalendar,
	parseRrule,
	parseIcsEvent,
};
