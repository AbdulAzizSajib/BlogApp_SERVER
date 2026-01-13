import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import cors from 'cors';
import { auth } from './lib/auth';
import postRouter from './Modules/post/post.router';
import commentRouter from './Modules/comment/comment.router';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.all('/api/auth/*splat', toNodeHandler(auth));

app.use('/posts', postRouter);
app.use('/comments', commentRouter);

export default app;
