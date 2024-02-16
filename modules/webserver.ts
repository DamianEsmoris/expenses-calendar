import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';

import { readIcsHeader } from './ics';
import { createEvent } from './event';
import { getEvents, insertEvent } from './db/controller';

const icsFile: string = 'output.ics';
const app = express();
const port = 5000;
const upload = multer();


app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

app.post('/newEvent', upload.none(), async (req, res) => {
  const {money, summary, date: d} = req.body;
  const date = new Date();
  date.setTime(d); 

  if(isNaN(money)) res.sendStatus(400);
  const event = createEvent({
	summary,
	description: Number(money),
	startDate: date,
	endDate: date,
	rrule: null,
  })

	const result = await insertEvent(event);
	res.json(result);
})

app.get('/getEvents/:month/:year', upload.none(), async (req, res) => {
  const { month, year } = req.params;
  if(month < 1 || month > 12 || year.length != 4)
  	req.sendStatus(400);

  const date = new Date(year, month-1);
  const events = await getEvents(date);
  res.json(events)
});

function runWebServer(){
	app.listen(port, () => console.log('server running on: '+port));
}

export {
	runWebServer
}

