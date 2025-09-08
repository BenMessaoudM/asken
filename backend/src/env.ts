export function validateEnv(): void {
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
  ] as const;

  const missing = required.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    missing.forEach((name) => console.error(`Missing environment variable: ${name}`));
    process.exit(1);
  }
}
