import { Request, Response } from 'express';
import { PostService } from './post.service';
import { PostStatus } from '../../generated/prisma/enums';

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        error: 'Unauthorized!',
      });
    }
    const result = await PostService.createPost(req.body, user.id as string);
    res.json({
      message: 'Post created successfully',
      data: result,
    });
  } catch (error) {
    console.log('error', error);
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const tags = req.query.tags ? (req.query.tags as string).split(',') : [];

    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === 'true'
      : undefined;

    const status = req.query.status as PostStatus | undefined;

    const authorId = req.query.authorId as string | undefined;

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as string | undefined;

    console.log(sortBy, sortOrder);
    const result = await PostService.getAllPost({
      search: search as string | undefined,
      tags: tags,
      isFeatured: isFeatured,
      status: status,
      authorId: authorId,
      page: page,
      limit: limit,
      skip: skip,
      sortBy: sortBy,
      sortOrder: sortOrder,
    });
    res.json({
      message: 'Posts fetched successfully',
      data: result,
    });
  } catch (error) {
    console.log('error', error);
    res.json({
      message: 'Something went wrong',
      data: null,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
};
