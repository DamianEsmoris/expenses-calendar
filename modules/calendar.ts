import { getTimezone, getTzid, IcsDateFormat} from './date';

type STANDARD = {
	BEGIN: "STANDARD",
	TZNAME: string,
	TZOFFSETFROM: string,
	TZOFFSETTO: string,
	END: "STANDARD",
}

type VTIMEZONE = {
	BEGIN: "VTIMEZONE",
	TZID: string,
	"LAST-MODIFIED": IcsDateFormat | null,	
	STANDARD: STANDARD,
	END: "VTIMEZONE",	
}

type VCALENDAR = {
	BEGIN: "VCALENDAR",
	VERSION: "2.0",
	PRODID: "//desmoris/expenses-calendar//ES",
	VTIMEZONE: VTIMEZONE,
}

function createCalendarHeader(): VCALENDAR { 
	const tz = getTimezone();
	const stdObj: STANDARD = {
		BEGIN: "STANDARD",
		TZNAME: tz, 
		TZOFFSETFROM: tz,
		TZOFFSETTO: tz,
		END: "STANDARD",
	};

	const tzObj: VTIMEZONE = {
		BEGIN: "VTIMEZONE",
		TZID: getTzid(),
		"LAST-MODIFIED":  null,
		STANDARD: stdObj,
		END: "VTIMEZONE",	
	}

	const header: VCALENDAR = {
		BEGIN: "VCALENDAR",
		VERSION: "2.0",
		PRODID: "//desmoris/expenses-calendar//ES",
		VTIMEZONE: tzObj
	}

	return header;
}

function checkHeader(header: VCALENDAR) {
	const checks = {
		starts: Object.keys(header)[0] === "BEGIN" && header.BEGIN === "VCALENDAR",
		version: header.VERSION == "2.0" || (!isNaN(header.VERSION) && header.VERSION >= 2.0),
		prodid: "PRODID" in header,
	}

	// at least i have 3 checks

	return checks;
}

export {
	VCALENDAR,
	createCalendarHeader,
	checkHeader
}

// https://ical.marudot.com/


