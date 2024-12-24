"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Sử dụng useRouter để lấy userId từ URL
import { doc, getDoc } from "firebase/firestore"; // Import các hàm cần thiết từ Firestore
import FormModal from "@/components/FormModal";
import Image from "next/image";
import Announcements from "@/components/Announcements";
import Performance from "@/components/Performance";
import BigCalendar from "@/components/BigCalendar";
import Link from "next/link";
import { role } from "@/lib/data";
import { db } from "@/firebaseConfig";
import useUserSet from "@/hook/useUserSets";

const SingleUserPage = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userSets } = useUserSet(); // Sử dụng hook để lấy tất cả người dùng
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const router = useRouter();

  // Sử dụng useEffect để đảm bảo useRouter chỉ chạy khi trang được render trên client
  useEffect(() => {
    if (router.query.userId) {
      setUserId(router.query.userId as string);
    }
  }, [router.query.userId]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return; // Nếu không có userId, không làm gì

      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Đảm bảo rằng userData không null và có dữ liệu trước khi truy cập vào các trường của nó
  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-koraSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/3">
              <Image
                src={
                  userData?.photo ||
                  "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=1200"
                }
                alt={userData?.name || "User Photo"}
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold">
                  {userData?.name || "User Name"}
                </h1>
                {role === "admin" && (
                  <FormModal
                    table="user"
                    type="update"
                    data={{
                      id: 1,
                      userId: userData?.id || "1234567890",
                      name: userData?.name || "John Doe",
                      email: userData?.email || "john@doe.com",
                      photo:
                        userData?.photo ||
                        "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
                      address: userData?.address || "123 Main St, Anytown, USA",
                      phone: userData?.phone || "1234567890",
                      date: userData?.date || "20/08/2003",
                      nation: userData?.nation || "VietNam",
                      vip: userData?.vip || true,
                      active: userData?.active || true,
                    }}
                  />
                )}
              </div>
              <p className="text-sm text-gray-500">
                {userData?.description ||
                  "Lorem ipsum, dolor sit amet consectetur adipisicing elit."}
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/country.png" alt="" width={14} height={14} />
                  <span>{userData?.nation || "Vietnam"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>{userData?.date || "January 2025"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{userData?.email || "user@gmail.com"}</span>
                </div>
                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{userData?.phone || "+1 234 567"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Small Cards, Bottom Section, etc. */}
          <div className="flex-1 flex gap-2 justify-between flex-wrap">
            {/* Các card khác */}
            {/* Bạn có thể thêm các phần tử ở đây nếu cần */}
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1 className="text-xl font-semibold">Các hoạt động</h1>
          <BigCalendar />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-koraSkyLight" href="/">
              User&apos;s Classes
            </Link>
            <Link className="p-3 rounded-md bg-koraPurpleLight" href="/">
              User&apos;s Students
            </Link>
            <Link className="p-3 rounded-md bg-koraYellowLight" href="/">
              User&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              User&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-koraSkyLight" href="/">
              User&apos;s Assignments
            </Link>
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleUserPage;
