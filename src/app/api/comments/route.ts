import { NextRequest, NextResponse } from "next/server";

import serverAuth from "@/app/libs/serverAuth";
import prisma from "@/app/libs/prismadb";

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { currentUser } = await serverAuth(req, res);
    const { body } = await req.json();
    const { postId } = req.q;

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid ID");
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId,
      },
    });

    // NOTIFICATION PART START
    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: "Someone replied on your tweet!",
            userId: post.userId,
          },
        });

        await prisma.user.update({
          where: {
            id: post.userId,
          },
          data: {
            hasNotification: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    // NOTIFICATION PART END

    return NextResponse.json({ comment }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("error", { status: 400 });
  }
};
