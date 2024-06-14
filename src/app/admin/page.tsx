import React from "react";
import Table from "../../components/Table";
import db from "@/config/db";
import DownloadButton from "@/components/DownloadButton";

const AdminPage: React.FC = async () => {
  const data = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  return (
    <body>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
          <DownloadButton />
        </div>
        <Table data={data} />
      </div>
    </body>
  );
};

export default AdminPage;
