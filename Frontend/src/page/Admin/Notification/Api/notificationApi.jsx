import axiosClient from "../../../../components/common/axiosClient";

export const getNotifications = async (limit = 10, offset = 0) => {
  const res = await axiosClient.get("/thong-bao", {
    params: { limit, offset },
  });
  return res.data.data;
};

export const getUnreadCount = async () => {
  const res = await axiosClient.get("/thong-bao/dem");
  return res.data.data;
};

export const markAsRead = async (id) => {
  await axiosClient.put(`/thong-bao/${id}/doc`);
};

export const markAllAsRead = async () => {
  await axiosClient.put("/thong-bao/doc-tat-ca");
};
