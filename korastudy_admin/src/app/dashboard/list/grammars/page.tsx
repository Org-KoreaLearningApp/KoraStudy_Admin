"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableList from "@/components/TableList";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import useGrammarSets from "@/hook/useGrammarSets";

const columns = [
  { header: "Chủ đề", accessor: "title" },
  { header: "Topik Level", accessor: "topikLevel" },
  { header: "Ngữ Pháp", accessor: "name" },
  { header: "Nghĩa", accessor: "mean" },
  { header: "Mô tả", accessor: "describe" },
  { header: "Cách dùng", accessor: "use" },
  { header: "Ví dụ", accessor: "example" },
  { header: "Action", accessor: "action" },
];

const GrammarPage = () => {
  const { GrammarSets, loading, deleteGrammar } = useGrammarSets();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  if (loading) {
    return <div>Loading...</div>;
  }

  // Tính toán dữ liệu dựa trên trang hiện tại
  const paginatedData = GrammarSets.flatMap((set) =>
    set.grammars.map((grammar) => ({
      ...grammar,
      title: set.title,
      topikLevel: set.topikLevel,
    }))
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(GrammarSets.flatMap((set) => set.grammars).length / itemsPerPage);

  const renderRow = (item: { id: string; title: string; topikLevel: string; name: string; mean: string; describe: string; use: string; example: string; createdAt: Date }) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-koraPurpleLight"
    >
      <td className="p-4">{item.title}</td>
      <td className="p-4">{item.topikLevel}</td>
      <td className="p-4">{item.name}</td>
      <td className="p-4">{item.mean}</td>
      <td className="p-4">{item.describe}</td>
      <td className="p-4">{item.use}</td>
      <td className="p-4">{item.example}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="grammar" type="update" data={item} />
              <FormModal table="grammar" type="delete" id={Number(item.id)} />
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
          Danh sách ngữ pháp
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
              <FormModal table="grammar" type="create" />
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

export default GrammarPage;