import { NextRequest, NextResponse } from "next/server";

import serverAuth from "@/app/libs/serverAuth";

export default async function handler(req: NextRequest, res: NextResponse) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req, res);

    return res.status(200).json(currentUser);
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
