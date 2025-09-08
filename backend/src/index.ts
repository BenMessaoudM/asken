import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { z } from 'zod';
import { validateEnv } from './env';

interface DecodedToken extends jwt.JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

validateEnv();

const app = express();
app.use(express.json());

// Ensure JWT secret is provided
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('JWT_SECRET environment variable is required');
  process.exit(1);
}

// MongoDB connection
const mongoUri = process.env.MONGO_URI as string;
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// JWT authentication middleware
const authenticate: express.RequestHandler = (req, res, next) => {
  const header = req.header('authorization');
  if (!header) return res.status(401).send('No token provided');
  if (!header.startsWith('Bearer ')) {
    return res.status(401).send('Invalid token format');
  }
  const token = header.substring('Bearer '.length);
  try {



    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
main
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
