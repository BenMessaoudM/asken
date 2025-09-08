import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Ensure JWT secret is provided
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

// MongoDB connection
const mongoUri = process.env.MONGO_URI || '';
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
    const decoded = jwt.verify(token, jwtSecret);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
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
