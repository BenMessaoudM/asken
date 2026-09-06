import test from "node:test";
import assert from "node:assert/strict";
import {bookingRetentionDate,estimateBooking,estimateOccurrence,hashBookingToken,helsinkiLocalToIso,isoToHelsinkiLocalInput,maxAdvanceDate,overlaps,sharesResource,validateOccurrence} from "../lib/booking.ts";

test("detects a partial overlap and permits touching endpoints",()=>{
  assert.equal(overlaps(new Date("2027-01-01T10:00:00Z"),new Date("2027-01-01T13:00:00Z"),new Date("2027-01-01T12:00:00Z"),new Date("2027-01-01T14:00:00Z")),true);
  assert.equal(overlaps(new Date("2027-01-01T10:00:00Z"),new Date("2027-01-01T12:00:00Z"),new Date("2027-01-01T12:00:00Z"),new Date("2027-01-01T14:00:00Z")),false);
});

test("resource conflicts only apply to a shared Cor space",()=>{
  assert.equal(sharesResource(["hall"],["hall","kitchen"]),true);
  assert.equal(sharesResource(["hall"],["kitchen"]),false);
});

test("external pricing applies the four-hour minimum and add-ons",()=>{
  const price=estimateOccurrence("external",new Date("2027-01-04T10:00:00Z"),new Date("2027-01-04T12:00:00Z"),["hall","kitchen","cabinet_sauna"]);
  assert.equal(price,28000);
});

test("Arcada association weekday and weekend pricing follows the rules",()=>{
  assert.equal(estimateOccurrence("arcada_association",new Date("2027-01-04T10:00:00Z"),new Date("2027-01-04T14:00:00Z"),["hall"]),0);
  assert.equal(estimateOccurrence("arcada_association",new Date("2027-01-08T10:00:00Z"),new Date("2027-01-08T14:00:00Z"),["hall"]),7500);
});

test("association packages include the sauna supplement per date",()=>{
  const occurrences=Array.from({length:3},(_,index)=>({startsAt:`2027-02-0${index+1}T10:00:00Z`,endsAt:`2027-02-0${index+1}T14:00:00Z`,resources:index<2?["hall","cabinet_sauna"]:["hall"]}));
  assert.equal(estimateBooking("arcada_association",occurrences,3),27000);
});

test("continuous overnight bookings are rejected",()=>{
  assert.match(validateOccurrence({startsAt:"2027-01-01T10:00:00Z",endsAt:"2027-01-02T08:00:00Z",resources:["hall"]})||"",/18 hours|calendar date/);
});

test("administrator pricing overrides are used by the estimator",()=>{
  const custom={externalFirstHours:2,externalFirstHourlyCents:4000,externalAfterHourlyCents:2000,externalKitchenCents:2500,saunaPerDateCents:1500,associationWeekendCents:6000,associationPackage3Cents:18000,associationPackage5Cents:29000,associationPackage10Cents:52000,internalFreeBookings:2,maxBookingHours:12,maxAdvanceMonths:12,maxDatesPerRequest:8,hallCapacity:90,kitchenCapacity:10,saunaCapacity:24,cleaningFeeCents:15000};
  assert.equal(estimateOccurrence("external",new Date("2027-01-04T10:00:00Z"),new Date("2027-01-04T13:00:00Z"),["hall","kitchen"],custom),12500);
  assert.equal(estimateBooking("arcada_association",[{startsAt:"2027-02-01T10:00:00Z",endsAt:"2027-02-01T12:00:00Z",resources:["hall","cabinet_sauna"]},{startsAt:"2027-02-02T10:00:00Z",endsAt:"2027-02-02T12:00:00Z",resources:["hall"]},{startsAt:"2027-02-03T10:00:00Z",endsAt:"2027-02-03T12:00:00Z",resources:["hall"]}],3,custom),19500);
});

test("administrator maximum duration is enforced",()=>{
  const custom={externalFirstHours:4,externalFirstHourlyCents:5000,externalAfterHourlyCents:3000,externalKitchenCents:5000,saunaPerDateCents:3000,associationWeekendCents:7500,associationPackage3Cents:21000,associationPackage5Cents:32500,associationPackage10Cents:60000,internalFreeBookings:1,maxBookingHours:8,maxAdvanceMonths:18,maxDatesPerRequest:10,hallCapacity:80,kitchenCapacity:8,saunaCapacity:20,cleaningFeeCents:15000};
  assert.match(validateOccurrence({startsAt:"2027-01-01T10:00:00Z",endsAt:"2027-01-01T19:00:00Z",resources:["hall"]},custom)||"",/8 hours/);
});

test("Helsinki wall-clock times survive UTC storage across seasons",()=>{
  assert.equal(helsinkiLocalToIso("2026-09-11T16:00"),"2026-09-11T13:00:00.000Z");
  assert.equal(helsinkiLocalToIso("2026-12-18T16:00"),"2026-12-18T14:00:00.000Z");
  assert.equal(isoToHelsinkiLocalInput("2026-09-11T13:00:00.000Z"),"2026-09-11T16:00");
});

test("booking horizons and retention use calendar periods",()=>{
  assert.equal(maxAdvanceDate(new Date("2026-08-31T10:00:00Z"),6).toISOString(),"2027-02-28T10:00:00.000Z");
  assert.equal(bookingRetentionDate(new Date("2026-09-06T00:00:00Z"),"request"),"2027-09-06T00:00:00.000Z");
  assert.equal(bookingRetentionDate(new Date("2026-09-06T00:00:00Z"),"operational"),"2028-09-06T00:00:00.000Z");
  assert.equal(bookingRetentionDate(new Date("2026-09-06T00:00:00Z"),"accounting"),"2032-10-06T00:00:00.000Z");
});

test("private booking access tokens are stored as one-way hashes",async()=>{
  const hash=await hashBookingToken("private-token");
  assert.equal(hash.length,64);
  assert.notEqual(hash,"private-token");
  assert.equal(hash,await hashBookingToken("private-token"));
});
