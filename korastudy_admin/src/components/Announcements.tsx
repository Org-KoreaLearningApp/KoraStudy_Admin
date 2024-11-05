"use client";

import { useState } from "react";

const announcements = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit",
    date: "2025-01-02",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit",
    date: "2025-01-03",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit",
    date: "2025-01-04",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
  {
    id: 5,
    title: "Lorem ipsum dolor sit",
    date: "2025-01-05",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
  },
];

const Announcements = () => {
  const [showAll, setShowAll] = useState(false);

  // Chỉ hiển thị 3 thông báo đầu tiên nếu showAll là false
  const displayedAnnouncements = showAll
    ? announcements
    : announcements.slice(0, 3);

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Thông báo</h1>
        <span
          className="text-xs text-gray-400 cursor-pointer"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Ẩn bớt" : "Xem thêm"}
        </span>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {displayedAnnouncements.map((announcement) => (
          <div
            key={announcement.id}
            className={`rounded-md p-4 ${
              announcement.id % 3 === 1
                ? "bg-koraSkyLight"
                : announcement.id % 3 === 2
                ? "bg-koraPurpleLight"
                : "bg-koraYellowLight"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium">{announcement.title}</h2>
              <span className="text-xs text-gray-400 bg-white rounded-md px-1 py-1">
                {announcement.date}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">
              {announcement.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
