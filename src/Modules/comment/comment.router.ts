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
  checker(UserRole.ADMIN, UserRole.USER),
  CommentController.deleteComment
);

commentRouter.patch(
  '/:commentId',
  checker(UserRole.ADMIN, UserRole.USER),
  CommentController.updateComment
);
commentRouter.patch(
  '/:commentId/moderate',
  checker(UserRole.ADMIN),
  CommentController.moderateComment
);
export default commentRouter;
