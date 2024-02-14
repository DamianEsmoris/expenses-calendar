import * as express from 'express';
import * as multer from 'multer';
import * as path from 'path';

import { readIcsHeader } from './ics';
import { createEvent } from './event';

const icsFile: string = 'output.ics';
const app = express();
const port = 5000;
const upload = multer();


app.use('/static', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
});

app.post('/newEvent', upload.none(), (req, res) => {
  const {money, summary, date: d} = req.body;
  const date = new Date();
  date.setTime(d); 

  if(isNaN(money)) res.sendStatus(400)
	readIcsHeader(icsFile).then(calendar => {
		let e = createEvent({
			summary,
			description: money,
			startDate: date,
			endDate: date,
			rrule: null,
			calendar
		})

		console.log(e)
		res.json(e);
	})
})

function runWebServer(){
	app.listen(port, () => console.log('server running on: '+port));

}

export {
	runWebServer
}

