import axiosClient from "@/components/common/axiosClient";

export const getAllSpecialties = async () => {
  const res = await axiosClient.get("/chuyen-khoa");
  return res.data;
};
