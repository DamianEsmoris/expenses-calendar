import { PrismaClient } from '@prisma/client'
import { VEVENT } from '../event'
import { formatDateSqlite } from '../date';


/**
 * Insert an event into the database
 * @param event an event object
 * @returns the event inserted
 */
async function insertEvent(event: VEVENT) {
    const prisma = new PrismaClient()
    try {
        const dbEvent = await prisma.event.create({
            data: {
                uid: event.UID,
                dtstamp: formatDateSqlite(event.DTSTAMP),
                dtstart: formatDateSqlite(event.DTSTART),
                dtend: formatDateSqlite(event.DTSTART),
                summary: event.SUMMARY,
                description: event.DESCRIPTION,
            },
        })

        await prisma.$disconnect();
        return dbEvent;
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
 }

/**
 * Inserts events into the database
 * @param events an array of event
 * @returns the events inserted
 */
async function insertManyEvents(events: VEVENT[]) {
    const prisma = new PrismaClient()
    try {
        const dbEvents = []
        for (let event of events){
            dbEvents.push(
                await prisma.event.create({
                    data: {
                        uid: event.UID,
                        dtstamp: formatDateSqlite(event.DTSTAMP),
                        dtstart: formatDateSqlite(event.DTSTART),
                        dtend: formatDateSqlite(event.DTSTART),
                        summary: event.SUMMARY,
                        description: event.DESCRIPTION,
                    },
                })
            );
        }
        await prisma.$disconnect();
        return dbEvents;
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
 }

 /**
  * Get the events filtered by date from the database
  * @param date month and year are extracted from here
  * @returns Array of events
  */
 async function getEvents(date: Date) {
    const userInputMonth = date.getMonth() + 1;
    const monthSubstring = userInputMonth.toString().padStart(2, '0');
    const prisma = new PrismaClient()
    try {
        const events = await prisma.event.findMany({
            where: { 
                dtstart: {
                    contains: `${date.getFullYear()}-${monthSubstring}-`
                },
                dtend: {
                    contains: `${date.getFullYear()}-${monthSubstring}-`
                }
             }
        })

        await prisma.$disconnect();
        return events;
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
}
/**
 * Find an event in the database by the uid
 * @param uid event's uid
 * @returns event from the database
 */
async function getEvent(euid: VEVENT["UID"]) {
    const prisma = new PrismaClient()

    try {
        const events = await prisma.event.findFirst({
            where: { 
                uid: {
                    contains: euid
                }
            }
        })

        await prisma.$disconnect();
        return events;
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
}

export {
    insertEvent,
    insertManyEvents,
    getEvent,
    getEvents,
}