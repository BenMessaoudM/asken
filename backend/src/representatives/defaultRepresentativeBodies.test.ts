import { defaultRepresentativeBodies } from './defaultRepresentativeBodies';

describe('default representative bodies', () => {
  it('seeds the bylaws-listed Arcada bodies without fake people', () => {
    expect(defaultRepresentativeBodies).toHaveLength(7);
    expect(defaultRepresentativeBodies.map((body) => body.name.sv)).toEqual(expect.arrayContaining([
      'Yrkeshögskolans styrelse',
      'Omprövningsnämnden',
      'Branschråd',
      'Kvalitetsråd',
      'Forskningsråd',
      'Pedagogiska rådet',
      'Rådet för kvalitet och samhällsansvar',
    ]));
    expect(defaultRepresentativeBodies[0]).toMatchObject({ defaultSeatCount: 1, defaultTermLengthMonths: 24, appointingBody: 'fullmaktige' });
    expect(defaultRepresentativeBodies[1]).toMatchObject({ defaultSeatCount: 1, defaultDeputySeatCount: 1 });
  });
});
