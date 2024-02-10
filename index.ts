import { readIcs } from './modules/ics';
import { insertAnEvent , insertManyEvents} from './modules/db/controller'


import { createCalendarHeader } from './modules/calendar'
import { createEvent} from './modules/event'

const icsFile: string = 'output.ics';
readIcs(icsFile);
