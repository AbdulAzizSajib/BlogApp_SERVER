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

const deleteComment = async (commentId: string, authorId: string) => {
  console.log('commentId', commentId, 'authorId', authorId);
};

export const CommentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
};
