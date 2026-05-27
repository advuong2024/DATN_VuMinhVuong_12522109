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
      message: "Thành công",
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

exports.getSpecialtyStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    const data = await ThongKe.getSpecialtyStats(
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );
    res.json({ data });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({ message: error.message });
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
      message: "Thành công",
      data,
    });
  } catch (error) {
    console.error("🔥 ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};