import axiosClient from "@/components/common/axiosClient";

export const getDashboardData = (params) => {
  return axiosClient.get("/thong-ke", { params });
};

export const getRevenueChartData = (params) => {
  return axiosClient.get("/thong-ke/revenue-chart", { params });
};