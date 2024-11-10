"use client";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import TableList from "@/components/TableList";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { AwaitedReactNode, JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import useVocabularySets from "@/hook/useVocabularySets";

const columns = [
  { header: "Chủ đề", accessor: "name" },
  { header: "Topik Level", accessor: "topikLevel" },
  { header: "Từ vựng", accessor: "word" },
  { header: "Nghĩa", accessor: "meaning" },
  { header: "URL", accessor: "url" },
  { header: "Ngày tạo", accessor: "createdAt" },
  { header: "Action", accessor: "action" },
];

const VocabularyPage = () => {
  const { vocabularySets, loading, deleteVocabulary } = useVocabularySets();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  if (loading) {
    return <div>Loading...</div>;
  }

  // Tính toán dữ liệu dựa trên trang hiện tại
  const paginatedData = vocabularySets.flatMap((set) =>
    set.vocabularies.map((vocab) => ({
      ...vocab,
      name: set.name,
      topikLevel: set.topikLevel,
    }))
  ).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalPages = Math.ceil(vocabularySets.flatMap((set) => set.vocabularies).length / itemsPerPage);

  const renderRow = (item: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; topikLevel: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; word: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; meaning: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; url: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<AwaitedReactNode> | null | undefined; createdAt: { toLocaleString: () => string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }; }) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-koraPurpleLight"
    >
      <td className="p-4">{item.name}</td>
      <td className="p-4">{item.topikLevel}</td>
      <td className="p-4">{item.word}</td>
      <td className="p-4">{item.meaning}</td>
      <td className="p-4">
        <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
      </td>
      <td className="p-4">{item.createdAt.toLocaleString()}</td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="vocabulary" type="update" data={item} />
              <FormModal table="vocabulary" type="delete" id={item.id as number} />
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
          Danh sách từ vựng
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
              <FormModal table="vocabulary" type="create" />
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

export default VocabularyPage;