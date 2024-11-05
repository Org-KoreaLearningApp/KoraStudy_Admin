import Pagination from "@/components/Pagination";
import TableList from "@/components/TableList";
import TableSearch from "@/components/TableSearch";
import { role, usersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

type User = {
  id: number;
  userId: string;
  name: string;
  email?: string;
  photo: string;
  phone: string;
  address: string;
  date: string;
  nation?: string;
  vip?: boolean;
  active?: boolean;
};

const columns = [
  { header: "Thông tin", accessor: "info" },
  {
    header: "Mã người dùng",
    accessor: "userId",
    className: "hidden md:table-cell",
  },
  {
    header: "địa chỉ",
    accessor: "adress",
    className: "hidden md:table-cell",
  },
  {
    header: "Số điện thoại",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Ngày sinh",
    accessor: "date",
    className: "hidden md:table-cell",
  },
  {
    header: "Quốc tịch",
    accessor: "nation",
    className: "hidden",
  },
  {
    header: "VIP",
    accessor: "vip",
    className: "hidden ",
  },
  {
    header: "Active",
    accessor: "active",
    className: "hidden md:table-cell",
  },
  {
    header: "Action",
    accessor: "action",
  },
];

const UserPage = () => {
  const renderRow = (item: User) => (
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
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.userId}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell">{item.date}</td>
      <td className="hidden md:table-cell">{item.nation}</td>
      <td className="hidden md:table-cell">{item.vip}</td>
      <td className="hidden md:table-cell">{item.active}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/users/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-koraSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-koraPurple">
              <Image src="/delete.png" alt="" width={16} height={16} />
            </button>
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
          Danh sách người dùng
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
          </div>
        </div>
      </div>
      {/* LIST */}
      <TableList columns={columns} renderRow={renderRow} data={usersData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default UserPage;
