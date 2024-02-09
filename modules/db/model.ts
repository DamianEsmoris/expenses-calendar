import { connectDb, client } from './connector';
import { VEVENT } from '../event'

async function insertEvent(event: VEVENT) {
	const db: any = await connectDb()
	let result;

	try {
		const collection = db.collection('events');
		result = await collection.insertOne(event);
	} catch(err) {
		console.error(`Error inserting an event: ${err}`)
	} finally {
		client.close();
		return result;
	}
}
	
async function findEvent(id: VEVENT['UID']) {
	const db: any = await connectDb()
	let event;

	try {
		const collection = db.collection('events');
		event = await collection.findOne({ UID: id });
	} catch(err) {
		console.error(`Error finding an event: ${err}`)
	} finally {
		client.close();
		return event;
	}
}

export {
	insertEvent,
	findEvent,
}
