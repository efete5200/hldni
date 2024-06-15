import { User } from "@prisma/client";
import ExcelJS from "exceljs";

import db from "@/config/db";
import { NextResponse } from "next/server";
import { formatGMTDate } from "@/server/service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const users: User[] = await db.user.findMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "성명", key: "name", width: 20 },
      { header: "휴대폰 번호", key: "phoneNumber", width: 20 },
      { header: "상담 신청 날짜", key: "createdAt", width: 30 },
      // { header: "상담 확인 날짜", key: "checkedAt", width: 20 },
      { header: "동의 1", key: "agreement1", width: 10 },
      { header: "동의 2", key: "agreement2", width: 10 },
    ];

    users.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        name: user.name,
        phoneNumber: user.phoneNumber,
        createdAt: formatGMTDate(new Date(user.createdAt)),
        // checkedAt: user.checkedAt ? new Date(user.checkedAt).toString() : null,
        agreement1: user.agreement1 ? "동의" : "미동의",
        agreement2: user.agreement2 ? "동의" : "미동의",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const headers = {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=users.xlsx",
    };

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export users" },
      { status: 500 }
    );
  }
}
