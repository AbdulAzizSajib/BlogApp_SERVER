import { CommentStatus, Post } from '../../../generated/prisma/client';
import { PostWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { PostStatus } from './../../../generated/prisma/enums';

const createPost = async (
  data: Omit<Post, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>,
  userId: string
) => {
  //logic to create post

  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  return result;
};

const getAllPost = async (payload: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
}) => {
  const andConditions: PostWhereInput[] = [];
  if (payload.search) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: payload.search as string,
            mode: 'insensitive',
          },
        },
        {
          content: {
            contains: payload.search as string,
            mode: 'insensitive',
          },
        },
        {
          tags: {
            has: payload.search as string,
          },
        },
      ],
    });
  }

  if (payload.tags.length > 0) {
    andConditions.push({
      tags: {
        hasSome: payload.tags as string[],
      },
    });
  }

  if (payload.isFeatured !== undefined) {
    andConditions.push({
      isFeatured: payload.isFeatured,
    });
  }
  if (payload.status) {
    andConditions.push({
      status: payload.status,
    });
  }
  if (payload.authorId) {
    andConditions.push({
      authorId: payload.authorId,
    });
  }

  const allPost = await prisma.post.findMany({
    skip: payload.skip,
    take: payload.limit,
    where: {
      AND: andConditions,
    },
    orderBy:
      payload.sortBy && payload.sortOrder
        ? {
            [payload.sortBy]: payload.sortOrder,
          }
        : { createdAt: 'desc' },

    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  //  get total count for pagination
  const total = await prisma.post.count({
    where: {
      AND: andConditions,
    },
  });
  return {
    data: allPost,
    pagination: {
      total,
      page: payload.page,
      limit: payload.limit,
      totalPages: Math.ceil(total / payload.limit),
    },
  };
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async tx => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        view: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: {
                createdAt: 'desc',
              },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (authorId: string) => {
  console.log(authorId);
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: 'ACTIVE',
    },
  });

  return await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
};

export const PostService = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
};
