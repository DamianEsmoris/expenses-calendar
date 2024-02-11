import { MongoClient } from 'mongodb'
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'expenses-calendar';
/**
 * Connects to the mongodb database.
 *
 * @returns a promise -> that resolves in the db connection.
 */
function connectDb() {
	return new Promise(async (resolve) => {
			let db;

			try {
				await client.connect();
				db = client.db(dbName);
			} catch(err) {
				console.error(`Error connecting to the db: ${err}`)
			} finally {
				resolve(db);
			}

		})
}

export {
	client,
	connectDb
}
