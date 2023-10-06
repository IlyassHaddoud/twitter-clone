import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";

export const POST = async (req: NextRequest) => {
  const { email, username, name, password } = await req.json();
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      name,
      hashedPassword,
    },
  });

  if (user) {
    return NextResponse.json({ user }, { status: 200 });
  } else {
    return NextResponse.json("register error", { status: 200 });
  }
};
