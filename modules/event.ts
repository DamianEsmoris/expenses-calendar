import { VCALENDAR } from "./calendar";
import { IcsDateFormat, formatDate } from "./date";

class RruleError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "RRULE Malformed";
    }
}

type ID = `${string}-${string}-${string}-${string}-${string}`;
type DtDate = `TZID=${string}:${IcsDateFormat}`;

const DAYS = [
    "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"
]

type Rrule = {
    "FREQ": "YEARLY" | "MONTHLY" | "WEEKLY" | "DAILY",
    "BYDAY"?: string,
    "COUNT"?: number,
    "UNTIL"?: string,
}

type VEVENT = {
	BEGIN: "VEVENT",
	UID: ID,
	DTSTAMP: DtDate,
	DTSTART: 	DtDate,
	RRULE: null | Rrule | string, 
	DTEND: DtDate
	SUMMARY: string, 
	DESCRIPTION: string,
	END: "VEVENT"
}

/**
 *  Checks an RRULE property is valid
 *  @param rrule object
 *  @param the prop key
 *  @param the value
 */
function RrulePropertyValidation(rrule: Rrule, key: string, value: unknown) : void{
	if (key === "COUNT" && typeof value === "number") {
		if (!/^(0|([1-9]\d*))$/.test(value+"")){
			throw new RruleError("Count param must be a natural number");
		}
		if ("UNTIL" in rrule) {
			throw new RruleError("Props until and count?");
		}
	}

	if (typeof value !== "string") return;

	switch (key) {
		case "BYDAY":
			if (!DAYS.includes(value)) throw new RruleError("The day is not valid");
			break;

		case "UNTIL":
			if ("COUNT" in rrule) throw new RruleError("Props count and until?");
			try {
					new Date(value);
			} catch (error) {
					throw new RruleError("The until date is not valid");
			}
			break;
	}
}

/**
 * Creates and validate the RRULE object from an object with the props.
 * 
 * @param rrule object
 * @returns rrule object
 */
function createRrule(rrule: Rrule){
    if (!("FREQ" in rrule)) throw new RruleError("FREQ param must be present");
		for (let [key, value] of Object.entries(rrule)){
			try {
				RrulePropertyValidation(rrule, key, value)
			} catch(error) {
				delete rrule[key];
				console.error(error);
			}
		}

	return rrule;
}

/**
 * Creates an event object.
 *
 * @param an object with the props: summary, description, startDate, endDate, rrule?, calendar
 * @returns the event object
 */
function createEvent(e: {summary: string, description: string, startDate: Date, endDate: Date, rrule: Rrule, calendar: VCALENDAR}){
	const tzid: string = e.calendar.VTIMEZONE.TZID;
	const event: VEVENT = {
		BEGIN: "VEVENT",
		UID: crypto.randomUUID(),
		DTSTAMP: `TZID=${tzid}:${formatDate(new Date())}`,
		DTSTART: `TZID=${tzid}:${formatDate(e.startDate)}`,
		RRULE: null,
		DTEND: `TZID=${tzid}:${formatDate(e.endDate)}`,
		SUMMARY: e.summary, 
		DESCRIPTION: e.description,
		END: "VEVENT"
	};

	if (e.rrule){
		event.RRULE = createRrule(e.rrule);
	}

	return event;
}

export {
		Rrule,
		VEVENT,
    createEvent,
}
