import { PrismaClient } from '@prisma/client'
import { VEVENT } from '../event'
import { formatDateSqlite } from '../date';



async function insertEvent(event: VEVENT) {
    const prisma = new PrismaClient()
    try {
        const task = await prisma.event.create({
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
        return task;
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
 }

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

export {
    insertEvent,
    getEvents
}