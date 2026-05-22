import axiosClient from "@/components/common/axiosClient";

export const getHomeData = async () => {
  const [specialties, doctors, services] = await Promise.all([
    axiosClient.get("/chuyen-khoa"),
    axiosClient.get("/nhan-vien"),
    axiosClient.get("/dich-vu"),
  ]);
  return {
    specialties: specialties.data,
    doctors: doctors.data,
    services: services.data,
  };
};
