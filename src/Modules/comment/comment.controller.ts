import { CommentService } from './comment.service';

import { Request, Response } from 'express';

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;

    const result = await CommentService.createComment(req.body);
    res.json({
      message: 'Comment created successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const CommentController = {
  createComment,
};
