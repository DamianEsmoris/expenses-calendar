import * as db from './model';
import { VEVENT } from '../event'

async function insertAnEvent(event: VEVENT) {
	const result = await db.insertEvent(event);
	db.closeConnection();
	return result;
}

async function insertManyEvents(events: VEVENT[]) {
	const result = await db.insertEvents(events);
	db.closeConnection();
	return result;
}

async function findAnEvent(id: VEVENT['UID']) {
	const event = await db.findEvent(id);
	db.closeConnection();
	return event;
}

async function closeDbConnection(){
		await db.closeConnection();
		db.closeConnection();
}

export {
	insertAnEvent,
	insertManyEvents,
	findAnEvent,
}
