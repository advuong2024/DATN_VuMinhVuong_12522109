import axiosClient from "@/components/common/axiosClient";

export const getAllDoctors = async () => {
  const res = await axiosClient.get("/nhan-vien");
  return res.data;
};
