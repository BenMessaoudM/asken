import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { validateEnv } from './env';

validateEnv();

const app = express();
app.use(express.json());

// MongoDB connection
const mongoUri = process.env.MONGO_URI as string;
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// JWT authentication middleware
const authenticate: express.RequestHandler = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).send('No token provided');
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST as string,
  port: parseInt(process.env.SMTP_PORT as string, 10),
  auth: {
    user: process.env.SMTP_USER as string,
    pass: process.env.SMTP_PASS as string,
  },
});

// Example route using Zod validation
const messageSchema = z.object({ message: z.string() });
app.post('/message', authenticate, (req, res) => {
  const result = messageSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json(result.error.flatten());
  }
  transporter
    .sendMail({
      from: process.env.SMTP_USER as string,
      to: process.env.SMTP_USER as string,
      subject: 'New Message',
      text: result.data.message,
    })
    .then(() => res.json({ status: 'sent' }))
    .catch((err) => res.status(500).json({ error: 'email error', details: err }));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
