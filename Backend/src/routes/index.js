const express = require("express");
const router = express.Router();

router.use("/benh-nhan", require("./benh_nhan.route"));
router.use("/nhan-vien", require("./nhan_vien.route"));
router.use("/tai-khoan", require("./tai_khoan.route"));
router.use("/lich-hen", require("./lich_hen.route"));
router.use("/phieu-kham", require("./phieu_kham.route"));
router.use("/thanh-toan", require("./thanh_toan.route"));
router.use("/thuoc", require("./thuoc.route"));
router.use("/danh-muc-thuoc", require("./danh_muc.route"));
router.use("/don-thuoc", require("./don_thuoc.route"));
router.use("/chi-tiet-don-thuoc", require("./chi_tiet_don_thuoc.route"));

module.exports = router;