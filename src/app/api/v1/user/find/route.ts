import { User } from "@prisma/client";

import db from "@/config/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users: User[] = await db.user.findMany();

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
