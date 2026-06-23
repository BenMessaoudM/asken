import { parseListQuery } from './listQuery';

const sortFields: [string, ...string[]] = ['createdAt', 'name'];

describe('parseListQuery', () => {
  it('applies list defaults', () => {
    expect(parseListQuery({}, sortFields, 'createdAt')).toEqual({
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'asc',
    });
  });

  it('parses filtering, sorting, and pagination', () => {
    expect(
      parseListQuery(
        { page: '2', limit: '50', sort: 'name', order: 'desc', filter: 'active' },
        sortFields,
        'createdAt',
      ),
    ).toEqual({
      page: 2,
      limit: 50,
      sort: 'name',
      order: 'desc',
      filter: 'active',
    });
  });

  it('rejects unsupported sorting fields', () => {
    expect(() => parseListQuery({ sort: 'password' }, sortFields, 'createdAt')).toThrow();
  });
});
