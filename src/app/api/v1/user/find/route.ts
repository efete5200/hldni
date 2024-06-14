import { User } from "@prisma/client";

import db from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("current time: ", new Date());
    const users: User[] = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json(users, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    );
  }
}
