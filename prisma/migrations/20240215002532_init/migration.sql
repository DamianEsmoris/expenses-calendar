-- CreateTable
CREATE TABLE "Event" (
    "uid" TEXT NOT NULL PRIMARY KEY,
    "dtstamp" TEXT NOT NULL,
    "dtstart" TEXT NOT NULL,
    "dtend" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "EventRrule" (
    "eventUid" TEXT NOT NULL PRIMARY KEY,
    "rrule" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "EventRrule_eventUid_fkey" FOREIGN KEY ("eventUid") REFERENCES "Event" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);
