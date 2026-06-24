import { eventInputSchema,eventQuerySchema } from './eventSchemas';
const base={translations:{en:{title:'Event',description:'Description',organizer:'ASK',location:'Cor'},sv:{title:'Evenemang',description:'Beskrivning',organizer:'ASK',location:'Cor'}},startAt:'2030-01-01T10:00:00.000Z',endAt:'2030-01-01T12:00:00.000Z',categoryId:'507f1f77bcf86cd799439011',eventStatus:'scheduled',featured:false};
it('accepts bilingual event data',()=>expect(eventInputSchema.parse(base).translations.sv.title).toBe('Evenemang'));
it('rejects invalid date ranges',()=>expect(eventInputSchema.safeParse({...base,endAt:base.startAt}).success).toBe(false));
it('parses calendar filters',()=>expect(eventQuerySchema.parse({locale:'en',period:'upcoming',featured:'true'})).toMatchObject({locale:'en',period:'upcoming',featured:true}));
