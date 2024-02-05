import * as fs from 'fs';
// import * as fsR from 'fs-reverse';
// import * as readline from 'readline';

import { createCalendarHeader, checkHeader } from './modules/calendar';
//import { createEvent } from './modules/event.ts';
import { parseCalendar } from './modules/parser';

const a = createCalendarHeader();
console.log(a)
// const e = createEvent({
//     sumary: "youtube music",
//     description: "",
//     startDate: new Date("2023-11-05T12:00:00"),
//     endDate: new Date("2023-11-05T12:00:00"),
//     rrule: {
//         FREQ: "MONTHLY"
//     },
//     money: 500,
//     calendar: a,
// })

const b = parseCalendar(a, []);
fs.writeFile('output.ics', b, err => {
    if (err) console.error(err);
    else console.log('File writed')
});

