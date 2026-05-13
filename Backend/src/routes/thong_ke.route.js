const express = require("express");
const router = express.Router();
const Controller = require("../controllers/thong_ke.controller");

router.get("/", Controller.getDashboard);
router.get("/revenue-chart", Controller.getRevenueChart);

module.exports = router;