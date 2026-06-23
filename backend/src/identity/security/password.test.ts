import { hashPassword, validatePassword, verifyPassword } from './password';

describe('password security', () => {
  it('rejects passwords that do not meet policy', () => {
    expect(() => validatePassword('short')).toThrow();
    expect(() => validatePassword('alllowercase123!')).toThrow();
  });
  it('hashes and verifies passwords with bcrypt', async () => {
    const hash = await hashPassword('StrongPassword1!', 10);
    expect(hash).not.toContain('StrongPassword1!');
    await expect(verifyPassword('StrongPassword1!', hash)).resolves.toBe(true);
    await expect(verifyPassword('WrongPassword1!', hash)).resolves.toBe(false);
  });
});
