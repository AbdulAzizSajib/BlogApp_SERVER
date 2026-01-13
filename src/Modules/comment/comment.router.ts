import Express from 'express';
import { CommentController } from './comment.controller';
import checker, { UserRole } from '../../middleware/checker';

const commentRouter = Express.Router();

commentRouter.post(
  '/',
  checker(UserRole.ADMIN, UserRole.USER),
  CommentController.createComment
);

export default commentRouter;
