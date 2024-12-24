import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

// Định nghĩa kiểu dữ liệu cho người dùng
export type UserItem = {
  id: string;
  name: string | null;
  email: string | null;
  photo: string | null;
  phone: string | null;
  adress: string | null;
  description: string | null;
  birthday: string | null;
  country: string | null;
  active: boolean;
  vip?: boolean | null;
};

const useUserSet = () => {
  // Khai báo state lưu trữ người dùng và trạng thái loading
  const [userSets, setUserSets] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Hàm lấy dữ liệu người dùng từ Firestore
  useEffect(() => {
    const fetchUserSets = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users: UserItem[] = querySnapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            name: data.name ?? "null",
            email: data.email ?? "null",
            photo: data.image ?? null,
            phone: data.phone ?? "null",
            adress: data.adress ?? "null",
            description: data.description ?? "null",
            birthday: data.birthday ?? "null",
            country: data.country ?? "null",
            active: data.active ?? false,
            vip: data.vip ?? "null",
          };
        });

        // Lọc ra những người dùng đang hoạt động
        setUserSets(users.filter((user) => user.active));
      } catch (error) {
        console.error("Error fetching user sets: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSets();
  }, []);

  // Hàm xóa người dùng
  const deleteUser = async (userId: string) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { active: false }); // Đánh dấu người dùng là không hoạt động

      // Cập nhật lại danh sách người dùng
      setUserSets((prevUsers) =>
        prevUsers.filter((user) => user.id !== userId)
      );

      console.log("User deleted successfully and removed from the list");
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  // Hàm cập nhật trạng thái VIP của người dùng
  const updateVip = async (userId: string, vipStatus: boolean) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { vip: vipStatus }); // Cập nhật trường vip

      // Cập nhật danh sách người dùng
      setUserSets((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, vip: vipStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating VIP status: ", error);
    }
  };

  // Hàm lấy thông tin người dùng theo ID
  const getUserId = (userId: string): UserItem | undefined => {
    return userSets.find((user) => user.id === userId);
  };

  // Trả về các dữ liệu cần thiết từ hook
  return { userSets, loading, deleteUser, updateVip, getUserId };
};

export default useUserSet;
