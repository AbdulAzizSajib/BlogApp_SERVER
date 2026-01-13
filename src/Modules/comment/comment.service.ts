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

export const CommentService = {
  createComment,
};
