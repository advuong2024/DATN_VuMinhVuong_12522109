const ThongKe = require("../models/thong_ke.model");

exports.getDashboard = async (req, res) => {
  try {
    const [
      summary,
      recentPatients,
      performance,
    ] = await Promise.all([
      ThongKe.getSummary(),
      ThongKe.getRecentPatients(),
      ThongKe.getPerformance(),
    ]);

    res.status(200).json({
      message: "Success",
      data: {
        summary,
        recentPatients,
        performance,
      },
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getRevenueChart = async (
  req,
  res
) => {
  try {
    const { range = "7" } = req.query;

    const data =
      await ThongKe.getRevenueChart(
        range
      );

    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};