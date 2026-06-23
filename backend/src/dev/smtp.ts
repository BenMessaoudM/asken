import { SMTPServer } from 'smtp-server';
import { loadEnv } from '../env';

const env = loadEnv();
const server = new SMTPServer({
  disabledCommands: env.SMTP_AUTH ? ['STARTTLS'] : ['AUTH', 'STARTTLS'],
  authOptional: !env.SMTP_AUTH,
  onAuth(auth, _session, callback) {
    if (auth.username === env.SMTP_USER && auth.password === env.SMTP_PASS) {
      callback(null, { user: auth.username });
      return;
    }
    callback(new Error('Invalid SMTP development credentials'));
  },
  onData(stream, _session, callback) {
    let bytes = 0;
    stream.on('data', (chunk: Buffer) => { bytes += chunk.length; });
    stream.on('end', () => {
      console.log(`Accepted development email (${bytes} bytes)`);
      callback();
    });
  },
});

server.listen(env.SMTP_PORT, env.SMTP_HOST, () => {
  console.log(`Development SMTP server listening on ${env.SMTP_HOST}:${env.SMTP_PORT}`);
});
