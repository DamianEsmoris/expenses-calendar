import {formatDate, getTimezone, getTzid, IcsDateFormat} from './date';

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
	// const checks = {};
	// const tocheck = [header, header.VTIMEZONE, header.VTIMEZONE.STANDARD];
	// const objs = [VCALENDAR, VTIMEZONE, STANDARD];
	
	// for (let i=0; i<tocheck.length; i++){
	// 	if(typeof tocheck[i] != "object") continue; 
	// 	checks[objs[i]["BEGIN"]] = Object.keys(objs[i]).map(k => k in tocheck[i])
	// 		.reduce((a,b) => a&&b);
	// }

	// return checks;
}

export {
	createCalendarHeader,
	checkHeader
}

// https://ical.marudot.com/


