import checker, { UserRole } from '../../middleware/checker';
import { PostController } from './post.controller';
import express from 'express';

const postRouter = express.Router();

postRouter.post('/', checker(UserRole.ADMIN), PostController.createPost);

postRouter.get('/', PostController.getAllPost);

postRouter.get('/:postId', PostController.getPostById);

export default postRouter;
