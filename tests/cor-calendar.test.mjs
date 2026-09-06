import test from "node:test";
import assert from "node:assert/strict";
import {parseCorCalendar} from "../lib/cor-calendar.ts";

const calendar=`BEGIN:VCALENDAR\r
BEGIN:VEVENT\r
UID:association@example.com\r
DTSTART;TZID=Europe/Helsinki:20260911T160000\r
DTEND;TZID=Europe/Helsinki:20260911T220000\r
SUMMARY:Commedia - Höstfest\r
LOCATION:Salen och köket\r
LAST-MODIFIED:20260901T120000Z\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:private@example.com\r
DTSTART;TZID=Europe/Helsinki:20260921T160000\r
DTEND;TZID=Europe/Helsinki:20260921T220000\r
SUMMARY:Private Person Birthday preliminary\r
LOCATION:Salen och köket\r
END:VEVENT\r
BEGIN:VEVENT\r
UID:cancelled@example.com\r
DTSTART;TZID=Europe/Helsinki:20261001T160000\r
DTEND;TZID=Europe/Helsinki:20261001T220000\r
SUMMARY:TLK\r
STATUS:CANCELLED\r
END:VEVENT\r
END:VCALENDAR`;

test("Cor iCalendar imports associations, colours, rooms and Helsinki times",()=>{
  const events=parseCorCalendar(calendar);
  assert.equal(events.length,2);
  assert.deepEqual(events[0],{
    sourceUid:"association@example.com",
    titleSv:"Commedia rf på Cor",
    titleEn:"Commedia rf at Cor",
    associationSlug:"commedia-rf",
    brandColor:"#F20D19",
    category:"association",
    startsAt:"2026-09-11T13:00:00.000Z",
    endsAt:"2026-09-11T19:00:00.000Z",
    resources:["hall","kitchen"],
    tentative:false,
    allDay:false,
    visiblePublicly:true,
    active:true,
    sourceUpdatedAt:"2026-09-01T12:00:00.000Z",
  });
});

test("private Cor bookings never expose the calendar summary",()=>{
  const privateEvent=parseCorCalendar(calendar)[1];
  assert.equal(privateEvent.titleSv,"Privat bokning");
  assert.equal(privateEvent.titleEn,"Private booking");
  assert.equal(privateEvent.associationSlug,null);
  assert.equal(privateEvent.tentative,true);
  assert.doesNotMatch(JSON.stringify(privateEvent),/Private Person|Birthday/);
});
