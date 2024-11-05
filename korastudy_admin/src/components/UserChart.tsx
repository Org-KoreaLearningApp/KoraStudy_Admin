"use client";

import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Jan",
    User: 4000,
    VIPUser: 2400,
  },
  {
    name: "Feb",
    User: 3000,
    VIPUser: 1398,
  },
  {
    name: "Mar",
    User: 2000,
    VIPUser: 9800,
  },
  {
    name: "Apr",
    User: 2780,
    VIPUser: 3908,
  },
  {
    name: "May",
    User: 1890,
    VIPUser: 4800,
  },
  {
    name: "Jun",
    User: 2390,
    VIPUser: 3800,
  },
  {
    name: "Jul",
    User: 3490,
    VIPUser: 4300,
  },
  {
    name: "Aug",
    User: 3490,
    VIPUser: 4300,
  },
  {
    name: "Sep",
    User: 3490,
    VIPUser: 4300,
  },
  {
    name: "Oct",
    User: 3490,
    VIPUser: 4300,
  },
  {
    name: "Nov",
    User: 3490,
    VIPUser: 4300,
  },
  {
    name: "Dec",
    User: 3490,
    VIPUser: 4300,
  },
];

const UserChart = () => {
  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Tổng số người dùng</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={20}
          />
          <Tooltip />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="User"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
          <Line
            type="monotone"
            dataKey="VIPUser"
            stroke="#FAE27C"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserChart;
