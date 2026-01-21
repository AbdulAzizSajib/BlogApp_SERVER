import checker, { UserRole } from '../../middleware/checker';
import { PostController } from './post.controller';
import express from 'express';

const postRouter = express.Router();

postRouter.post(
  '/',
  checker(UserRole.ADMIN, UserRole.USER),
  PostController.createPost
);

postRouter.get('/', PostController.getAllPost);

postRouter.get(
  '/myPosts',
  checker(UserRole.ADMIN, UserRole.USER),
  PostController.getMyPosts
);

postRouter.get('/:postId', PostController.getPostById);
export default postRouter;
