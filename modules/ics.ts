import * as fs from 'fs';
import * as fsR from 'fs-reverse';
import * as readline from 'readline';

import { createCalendarHeader, checkHeader, VCALENDAR} from './modules/calendar';
import { createEvent, VEVENT } from './modules/event';
import { parseCalendar, semicolonProps } from './modules/parser';
import { insertAnEvent, findAnEvent } from './modules/db/controller'


function readIcs() {
	return new Promise<VCALENDAR> ((resolve) => {
		let objs: object[] = [{}], i = 0;

		const lineReader = readline.createInterface({
				input: fs.createReadStream('output.ics')
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

readIcs().then(header => {
    const checks = checkHeader(header);
    if (!Object.values(checks).map((a,b) => a&&b)){
        console.log(checks)
        return false
    }

    console.log('All green!');
    const readStream = fsR('output.ics');

		let events: VEVENT[] = [];
		let buffer: string[] = [];
		let calendarCloseTagNotFound = true;
		let stopReading: boolean;

    readStream.on('data', (line: string) => {
			if (calendarCloseTagNotFound){
				if (line === "END:VCALENDAR") {
					calendarCloseTagNotFound = false;
					return;
				}
			}
			
			buffer.push(line);
			stopReading = processBuffer(buffer, events);
			if (stopReading) {
				console.log(events)
			}
	})
});

function processBuffer(buffer: string[], events: VEVENT[]) {
	if (buffer.at(-1) === "BEGIN:VEVENT") {
		buffer = buffer.reverse();	

		const obj = {};
		buffer.forEach(s => {
			let substr = s.split(semicolonProps.find(prop => s.includes(prop)) ? ';' : ':');
			obj[substr[0]] = substr[1];
		});
		
		
		let event: VEVENT = <VEVENT>obj
		let eventExists = findAnEvent(event.UID);
		if (eventExists) return true; // must be changed to a db check

		while (buffer.length) {
			buffer.pop();
		}

		events.push(event);
		return false;
	} if (buffer.at(-1) === "END:VTIMEZONE") {
		return true;
	}
}

