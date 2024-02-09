import { createCalendarHeader } from './modules/calendar';
import { createEvent, VEVENT } from './modules/event';
import { insertAnEvent, findAnEvent } from './modules/db/controller'

const a = createCalendarHeader()
const e = createEvent({
    summary: "youtube music",
    description: "400",
    startDate: new Date("2022-11-05T12:00:00"),
    endDate: new Date("2022-11-05T12:00:00"),
    rrule: {
        FREQ: "MONTHLY",
				COUNT: 3,
    },
    calendar: a,
});

//insertAnEvent(e);
//findAnEvent('63143f1c-eeca-4e92-9610-7c9300ef657c').then((x:any) => console.log(x));
// 
// const b = parseCalendar(a, [e]);
// fs.writeFile('output.ics', b, err => {
//     if (err) console.error(err);
//     else console.log('File writed')
// });
