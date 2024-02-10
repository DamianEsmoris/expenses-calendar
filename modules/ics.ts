import * as fs from 'fs';
import * as rlr from 'reverse-line-reader';

import * as readline from 'readline';

import { checkHeader, VCALENDAR} from './calendar';
import { VEVENT } from './event';
import { semicolonProps } from './parser';
import { findAnEvent, insertAnEvent } from './db/controller'


function readHeaderIcs(icsFile: string) {
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

async function readIcs(icsFile: string) {
	const header = await readHeaderIcs(icsFile);
	const checks = checkHeader(header);
	if (!Object.values(checks).map((a,b) => a&&b)){
			console.log(checks)
			return false
	}

	console.log('All green!');

	let buffer: string[] = [];
	let events: VEVENT[] = [];
	let calendarCloseTagNotFound = true;

	rlr.eachLine(icsFile, async (line: string) => {
		if (calendarCloseTagNotFound){
			if (line === "END:VCALENDAR") {
				calendarCloseTagNotFound = false;
				return;
			}
		}
	
		buffer.push(line);
		const result = processBuffer(buffer);
		if (typeof result === "object") {
			buffer=[];
			if (await findAnEvent(result.UID)) {
				return;
			} else {
				events.push(result);
				await insertAnEvent(result);
			}
		}
	})

	setTimeout(() => {
	console.log(events);
	}, 500);

	// this is ugly but it works.
	//		maybe i can use a function, or a callback after insert the last event (?
	//
	// the 
}

function processBuffer(buffer: string[]): VEVENT | null | number{
	if (buffer.at(-1) === "BEGIN:VEVENT") {
		const event = parseEvent(buffer);
		return event ? event : null;
	}
}

function parseEvent(eventBuffer: string[]): VEVENT {
    const event: Object = {};
    for (const line of eventBuffer) {
        const [key, value] = line.split(semicolonProps.find(prop => line.includes(prop)) ? ';' : ':');
        event[key] = value;
    }
    return <VEVENT>event;
}

export {
	readIcs
}
