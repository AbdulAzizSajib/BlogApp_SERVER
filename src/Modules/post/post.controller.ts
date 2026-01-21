import { Request, Response } from 'express';
import { PostService } from './post.service';
import { PostStatus } from '../../../generated/prisma/enums';
import paginationSortingHelper from '../../helpers/paginationSortingHelper';

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
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
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Something went wrong',
      data: null,
    });
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

    // const page = Number(req.query.page ?? 1);
    // const limit = Number(req.query.limit ?? 10);
    // const skip = (page - 1) * limit;
    // const sortBy = req.query.sortBy as string | undefined;
    // const sortOrder = req.query.sortOrder as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

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

const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    // console.log('Post ID:', postId);
    if (!postId) {
      return res.status(400).json({
        error: 'Post ID is required',
      });
    }
    const result = await PostService.getPostById(postId);
    if (!result) {
      return res.status(404).json({
        message: 'Post not found',
        data: null,
      });
    }
    res.status(200).json({
      message: 'Post fetched successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong',
      data: null,
    });
  }
};
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
        data: null,
      });
    }
    const result = await PostService.getMyPosts(user.id as string);

    res.status(200).json({
      message: 'Your posts fetched successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Something went wrong',
      data: null,
    });
  }
};

export const PostController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
};
