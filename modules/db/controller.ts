import * as db from './model';
import { VEVENT } from '../event'

/**
 * Insets an event in the events collection.
 *
 * @param the event object
 * @returns the object inserted
 */
async function insertAnEvent(event: VEVENT) {
	const result = await db.insertEvent(event);
	db.closeConnection();
	return result;
}

/**
 * Insert multiple events in the events collection.
 *
 * @param an events array
 * @returns the result of the insert
 */
async function insertManyEvents(events: VEVENT[]) {
	if (!events.length) return null;
	const result = await db.insertEvents(events);
	db.closeConnection();
	return result;
}

/**
 * Finds an event by the UID.
 *
 * @param the event uid
 * @returns if finds the event, the event or null if not
 */
async function findAnEvent(id: VEVENT['UID']) {
	const event = await db.findEvent(id);
	db.closeConnection();
	return event;
}

export {
	insertAnEvent,
	insertManyEvents,
	findAnEvent,
}
