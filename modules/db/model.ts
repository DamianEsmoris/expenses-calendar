import { connectDb, client } from './connector';
import { VEVENT } from '../event'

/**
 * Insets an event in the events collection.
 *
 * @param the event object
 * @returns the object inserted
 */
async function insertEvent(event: VEVENT) {
	const db: any = await connectDb()
	let result;

	try {
		const collection = db.collection('events');
		result = await collection.insertOne(event);
		return result;
	} catch(err) {
		console.error(`Error inserting an event: ${err}`);
		throw err;
	}
}

/**
 * Insert multiple events in the events collection.
 *
 * @param an events array
 * @returns the result of the insert
 */
async function insertEvents(events: VEVENT[]) {
	const db: any = await connectDb()
	let result;

	try {
		const collection = db.collection('events');
		result = await collection.insertMany(events);
		return result;
	} catch(err) {
		console.error(`Error inserting the events: ${err}`);
		throw err;
	}
}

/**
 * Finds an event by the UID.
 *
 * @param the event uid
 * @returns if finds the event, the event or null if not
 */
async function findEvent(id: VEVENT['UID']) {
	const db: any = await connectDb()
	let event;

	try {
		const collection = db.collection('events');
		event = await collection.findOne({ UID: id });
		return event;
	} catch(err) {
		console.error(`Error finding an event: ${err}`);
		throw err;
	}}

/**
 * Closes the db connection ( this is a method for avoid problems with the operation )
 */
async function closeConnection(){
		try {
			await client.close();
		} catch (err) {
			console.error(`Error closing the connection to the database: ${err}`);
			throw err;
		}
}

export {
	closeConnection,
	insertEvent,
	insertEvents,
	findEvent,
}
