import Express from 'express';
import { CommentController } from './comment.controller';
import checker, { UserRole } from '../../middleware/checker';

const commentRouter = Express.Router();

commentRouter.post(
  '/',
  checker(UserRole.ADMIN, UserRole.USER),
  CommentController.createComment
);
commentRouter.get('/:commentId', CommentController.getCommentById);
commentRouter.get('/author/:authorId', CommentController.getCommentsByAuthor);
commentRouter.get('/author/:authorId', CommentController.getCommentsByAuthor);
commentRouter.delete(
  '/:commentId',
  // checker(UserRole.ADMIN, UserRole.USER),
  CommentController.deleteComment
);
export default commentRouter;
