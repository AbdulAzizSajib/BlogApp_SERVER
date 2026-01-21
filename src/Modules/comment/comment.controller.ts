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
    res.status(200).json({
      message: 'Comment deleted successfully',
      data: result,
    });
  } catch (e) {
    res.status(400).json({
      error: 'Comment deletion failed',
      details: e,
    });
  }
};
const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.updateComment(
      commentId as string,
      user?.id as string,
      req.body
    );
    res.status(200).json({
      message: 'Comment updated successfully',
      data: result,
    });
  } catch (e) {
    res.status(400).json({
      error: 'Comment update failed',
      details: e,
    });
  }
};
const moderateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await CommentService.moderateComment(
      commentId as string,
      req.body
    );
    res.status(200).json({
      message: 'Comment moderated successfully',
      data: result,
    });
  } catch (e) {
    const errorMessage =
      e instanceof Error ? e.message : 'Comment update failed!';
    res.status(400).json({
      error: errorMessage,
      details: e,
    });
  }
};

export const CommentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};
