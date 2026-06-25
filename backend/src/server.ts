import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { createApp } from './app';
import { MongooseContentService } from './cms/services/mongooseContentService';
import { loadEnv } from './env';
import { MongooseNewsService } from './news/services/mongooseNewsService';
import { MongooseEventService } from './events/services/mongooseEventService';
import { MongooseIdentityService } from './identity/services/mongooseIdentityService';
import { MongooseBookingService } from './booking/services/mongooseBookingService';

export async function startServer() {
  const env = loadEnv();
  await mongoose.connect(env.MONGO_URI);
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    ...(env.SMTP_AUTH ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } } : {}),
  });
  const cmsService = new MongooseContentService();
  const app = createApp({
    env,
    identityService: new MongooseIdentityService(env),
    cmsService,
    newsService: new MongooseNewsService(cmsService),
    eventService: new MongooseEventService(cmsService),
    bookingService: new MongooseBookingService(async (notification) => {
      await transporter.sendMail({ from: env.SMTP_USER, to: notification.to, subject: notification.subject, text: notification.text.replaceAll('/booking/', env.FRONTEND_URL + '/booking/') });
    }),
    sendMessage: async (message) => {
      await transporter.sendMail({ from: env.SMTP_USER, to: env.SMTP_USER, subject: 'New Message', text: message });
    },
  });
  return app.listen(env.PORT, () => console.log(`Server listening on port ${env.PORT}`));
}
