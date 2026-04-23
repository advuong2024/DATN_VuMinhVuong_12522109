const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const routes = require("./routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("API Phòng khám đang chạy 🚀");
});

app.use((req, res) => {
  res.status(404).json({
    message: "Không tìm thấy API",
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Lỗi server",
    error: err.message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});