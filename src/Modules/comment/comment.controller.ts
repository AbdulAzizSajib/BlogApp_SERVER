import { CommentService } from './comment.service';

import { Request, Response } from 'express';
// import { auth } from './../../lib/auth';

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
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await CommentService.getCommentById(commentId as string);
    res.json({
      message: 'Comment fetched successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const result = await CommentService.getCommentsByAuthor(authorId as string);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: 'Comment fetched failed',
      details: e,
    });
  }
};
const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.deleteComment(
      commentId as string,
      user?.id as string
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({
      error: 'Comment fetched failed',
      details: e,
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
};
