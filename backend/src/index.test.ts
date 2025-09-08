import { z } from 'zod';

const messageSchema = z.object({ message: z.string() });

describe('Zod validation', () => {
  it('validates a correct message', () => {
    const data = { message: 'hello' };
    expect(messageSchema.parse(data)).toEqual(data);
  });

  it('throws on invalid message', () => {
    expect(() => messageSchema.parse({})).toThrow();
  });
});
