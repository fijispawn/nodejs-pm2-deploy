import 'dotenv/config';

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import cors from 'cors';

import errorHandler from './middlewares/error-handler';
import { DB_ADDRESS } from './config';
import routes from './routes';

const { PORT = 3000, CLIENT_ORIGIN } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS);

const allowedOrigin = CLIENT_ORIGIN || 'https://mestechko.nomorepartiessbs.ru';

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  }),
);

app.options(
  '*',
  cors({
    origin: allowedOrigin,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(routes);
app.use(errors());
app.use(errorHandler);


app.listen(PORT, () => console.log('ok'));
