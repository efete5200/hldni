"use client";

import React, { useEffect, useState } from "react";
import Table from "../../components/Table";
import DownloadButton from "@/components/DownloadButton";
import { User } from "@prisma/client";

const AdminPage: React.FC = () => {
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/v1/user/find", {
        cache: "no-store",
      });
      const fetchedData = await response.json();
      setData(fetchedData);
    };
    fetchData();
  }, []);

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
