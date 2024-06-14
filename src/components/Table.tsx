import { formatGMTDate } from "@/server/service";
import { User } from "@prisma/client";
import React from "react";

interface TableProps {
  data: User[];
}

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg text-center">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
              성명
            </th>
            <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
              휴대폰 번호
            </th>
            <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
              상담 신청 날짜
            </th>
            <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
              동의 1
            </th>
            <th className="w-1/6 py-3 px-4 uppercase font-semibold text-sm">
              동의 2
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="w-1/6 py-3 px-4">{user.name}</td>
              <td className="w-1/6 py-3 px-4">{user.phoneNumber}</td>
              <td className="w-1/6 py-3 px-4">
                {formatGMTDate(new Date(user.createdAt))}
              </td>
              <td className="w-1/6 py-3 px-4">
                {user.agreement1 ? "동의" : "미동의"}
              </td>
              <td className="w-1/6 py-3 px-4">
                {user.agreement2 ? "동의" : "미동의"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
