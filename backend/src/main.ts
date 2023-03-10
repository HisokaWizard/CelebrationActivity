import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { router } from './services/auth/router/router.js';
import { errorMiddleware } from './middlewares/error-middleware.js';
import { nnRouter } from './services/neuralNetwork/router/router.js';

const PORT = process.env.PORT ?? 9000;
dotenv.config({ path: path.resolve('./', './.env') });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  }),
);
app.use('/', router);
app.use('/', nnRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL ?? '', {}, () => null);
    app.listen(PORT, () => {
      console.log(`Application run on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
