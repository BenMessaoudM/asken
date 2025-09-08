import { validateEnv } from './env';

describe('validateEnv', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('exits if a required env variable is missing', () => {
    delete process.env.MONGO_URI;
    process.env.JWT_SECRET = 'secret';
    process.env.SMTP_HOST = 'host';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    const exitSpy = jest
      .spyOn(process, 'exit')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation((() => {}) as any);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    validateEnv();
    expect(errorSpy).toHaveBeenCalledWith('Missing environment variable: MONGO_URI');
    expect(exitSpy).toHaveBeenCalledWith(1);
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('does not exit when all env variables are present', () => {
    process.env.MONGO_URI = 'mongo';
    process.env.JWT_SECRET = 'secret';
    process.env.SMTP_HOST = 'host';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'user';
    process.env.SMTP_PASS = 'pass';
    const exitSpy = jest
      .spyOn(process, 'exit')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation((() => {}) as any);
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    validateEnv();
    expect(errorSpy).not.toHaveBeenCalled();
    expect(exitSpy).not.toHaveBeenCalled();
    exitSpy.mockRestore();
    errorSpy.mockRestore();
  });
});
