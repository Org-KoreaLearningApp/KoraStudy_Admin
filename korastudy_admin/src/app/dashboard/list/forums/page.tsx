"use client";

import { useState } from "react";
import Pagination from "@/components/Pagination";
import TableList from "@/components/TableList";
import TableSearch from "@/components/TableSearch";
import { forumsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import FormModal from "@/components/FormModal";

type Forum = {
  id: number;
  name?: string;
  topik?: string;
  photo: string;
  vocabularyId?: string;
  file?: string;
  content?: string;
  upDate?: string;
};

const columns = [
  { header: "Thông tin", accessor: "info" },
  {
    header: "Mã từ vựng",
    accessor: "vocabularyId",
    className: "hidden md:table-cell",
  },
  {
    header: "File",
    accessor: "file",
    className: "hidden md:table-cell",
  },
  {
    header: "Nội dung",
    accessor: "content",
    className: "hidden md:table-cell",
  },
  {
    header: "Ngày cập nhật",
    accessor: "upDate",
    className: "hidden md:table-cell",
  },
  {
    header: "Action",
    accessor: "action",
  },
];

const ForumPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(forumsData.length / itemsPerPage);

  // Tính toán dữ liệu dựa trên trang hiện tại
  const paginatedData = forumsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const renderRow = (item: Forum) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-koraPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Image
          src={item.photo}
          alt=""
          width={40}
          height={40}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.topik}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.vocabularyId}</td>
      <td className="hidden md:table-cell">{item.file}</td>
      <td className="hidden md:table-cell">{item.content}</td>
      <td className="hidden md:table-cell">{item.upDate}</td>
      <td>
        <div className="flex items-center gap-2">
          {/* Nếu chưa làm kịp thì từ từ làm cái view forum */}
          <Link href={`/list/forums/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-koraSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="forum" type="update" data={item} />
              <FormModal table="forum" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Danh sách bài đăng
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-koraYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-koraYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-koraYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal table="forum" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <TableList columns={columns} renderRow={renderRow} data={paginatedData} />
      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ForumPage;
