"use client";

import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    user: "John Doe",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    user: "Jane Smith",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    user: "Alice Johnson",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    user: "Jane Smith",
  },
  {
    id: 5,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    user: "Alice Johnson",
  },
];

const ForumCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [showAll, setShowAll] = useState(false);

  // Chỉ hiển thị 3 sự kiện nếu showAll là false
  const displayedEvents = showAll ? events : events.slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} locale="vi-VN" />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Forums</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {displayedEvents.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-koraSky even:border-t-koraPurple"
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            <p className="mt-2 text-gray-500 text-xs">Posted by {event.user}</p>
          </div>
        ))}
      </div>
      {/* Nút Xem thêm/Xem bớt */}
      {events.length > 3 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-koraBlue underline"
        >
          {showAll ? "Ẩn bớt" : "Xem thêm"}
        </button>
      )}
    </div>
  );
};

export default ForumCalendar;
