import axiosClient from "@/components/common/axiosClient";

export const getHomeData = async () => {
  const [specialties, doctors] = await Promise.all([
    axiosClient.get("/chuyen-khoa"),
    axiosClient.get("/nhan-vien"),
  ]);
  return {
    specialties: specialties.data,
    doctors: doctors.data,
  };
};
