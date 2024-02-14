import * as fs from 'fs';
import * as rlr from 'reverse-line-reader';
import * as readline from 'readline';

import { checkHeader, VCALENDAR} from './calendar';
import { VEVENT } from './event';
import { parseIcsEvent } from './parser';
import { findAnEvent, insertManyEvents } from './db/controller'

/**
 * Reads the header of an .ics file
 *
 * @param path of the ics file
 * @returns promise -> that resolves in a calendar object
 */
function readIcsHeader(icsFile: string) {
	return new Promise<VCALENDAR> ((resolve) => {
		let objs: object[] = [{}], i = 0;

		const lineReader = readline.createInterface({
				input: fs.createReadStream(icsFile)
		});
			
		lineReader.on('line', function (line) {
			if(line === "BEGIN:VEVENT"){
				lineReader.close();
				lineReader.removeAllListeners();
				return false;
			}

			const [key, value] = line.split(':');
			if(key === "BEGIN" && value !== "VCALENDAR"){
				objs[i][value] = {};
				objs[i+1] = objs[i][value];
				i++
			}

			objs[i][key] = value;
			if(key === "END"){
					i--;
			}
					
		});
			
		lineReader.on('close', function () {
			resolve(<VCALENDAR>objs[0])
		});

	})
}


/**
 * Reads an .ics file
 *
 * @param path of the file
 * @returns the file parsed to an object
 */
async function readIcs(icsFile: string) {
	const header = await readIcsHeader(icsFile);
	const checks = checkHeader(header);
	if (!Object.values(checks).map((a,b) => a&&b)){
			console.log(checks)
			return false
	}

	let lines: string[] = [];
	let events: VEVENT[] = [];
	let calendarCloseTagNotFound = true;
	let callbackTimeout;

	rlr.eachLine(icsFile, async (line: string) => {
		if (calendarCloseTagNotFound){
			if (line === "END:VCALENDAR") {
				calendarCloseTagNotFound = false;
				return;
			}
		}
	
		lines.push(line);
		const result = processIcsLine(lines);
		if (typeof result === "object") {
			lines=[];
			if(callbackTimeout) clearTimeout(callbackTimeout);
			callbackTimeout = setTimeout(async() => insertManyEvents(events), 500);		

			if (await findAnEvent(result.UID)) {
				return;
			} else {
				events.push(result);
			}
		}
	})

	
}

/**
 * Handles the processing of the ics file.
 *
 * @param the ics lines array
 * @returns if is parsed the event, if not returns null.
 */
function processIcsLine(lines: string[]): VEVENT | null {
	if (lines.at(-1) === "BEGIN:VEVENT") {
		const event = parseIcsEvent(lines);
		return event ? event : null;
	}
}

export {
	readIcsHeader,
	readIcs
}
