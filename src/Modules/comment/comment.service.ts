import { CommentStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  try {
    await prisma.post.findFirstOrThrow({
      where: {
        id: payload.postId,
      },
    });

    if (payload.parentId) {
      await prisma.comment.findUniqueOrThrow({
        where: {
          id: payload.parentId,
        },
      });
    }

    const commentData = await prisma.comment.create({
      data: payload,
    });
    return commentData;
  } catch (error) {
    console.log(error);
  }
};

const getCommentById = async (commentId: string) => {
  console.log('Comment ID', commentId);
  return await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          view: true,
        },
      },
    },
  });
};

// const getCommentsByAuthor = async (authorId: string) => {
//   return await prisma.comment.findMany({
//     where: {
//       authorId,
//     },
//   });
// };

const getCommentsByAuthor = async (authorId: string) => {
  return await prisma.comment.findMany({
    where: {
      authorId,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
};

// add cascade delete to prisma schema for comments so that replies are also deleted
const deleteComment = async (commentId: string, authorId: string) => {
  const commentData = await prisma.comment.findFirstOrThrow({
    where: {
      id: commentId,
      authorId: authorId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  return await prisma.comment.delete({
    where: {
      id: commentData.id,
    },
  });
};

const updateComment = async (
  commentId: string,
  authorId: string,
  data: { content?: string; status?: CommentStatus }
) => {
  await prisma.comment.findFirstOrThrow({
    where: {
      id: commentId,
      authorId,
    },
    select: {
      id: true,
    },
  });

  return await prisma.comment.update({
    where: {
      id: commentId,
      authorId,
    },
    data,
  });
};

const moderateComment = async (
  commentId: string,
  data: { status: CommentStatus }
) => {
  console.log('commentId in service:', commentId, 'data:', data);
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (commentData.status === data.status) {
    throw new Error('Comment is already in the desired status');
  }

  return await prisma.comment.update({
    where: {
      id: commentId,
    },
    data,
  });
};

export const CommentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};
