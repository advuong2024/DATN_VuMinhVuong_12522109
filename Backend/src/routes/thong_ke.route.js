const express = require("express");
const router = express.Router();
const Controller = require("../controllers/thong_ke.controller");

router.get("/", Controller.getDashboard);
router.get("/revenue-chart", Controller.getRevenueChart);
router.get("/chuyen-khoa", Controller.getSpecialtyStats);

module.exports = router;