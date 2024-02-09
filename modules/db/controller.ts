import { insertEvent, findEvent } from './model';
import { VEVENT } from '../event'

async function insertAnEvent(event: VEVENT) {
	const result = await insertEvent(event);
	return result;
}

async function findAnEvent(id: VEVENT['UID']) {
	const event = await findEvent(id);
	return event;
}

export {
	insertAnEvent,
	findAnEvent,
}
