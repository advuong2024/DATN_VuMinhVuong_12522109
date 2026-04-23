const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth.router"))
router.use("/benh-nhan", require("./benh_nhan.route"));
router.use("/nhan-vien", require("./nhan_vien.route"));
router.use("/tai-khoan", require("./tai_khoan.route"));
router.use("/dat-lich", require("./dat_lich.route"));
router.use("/phieu-kham", require("./phieu_kham.route"));
router.use("/thanh-toan", require("./thanh_toan.route"));
router.use("/thuoc", require("./thuoc.route"));
router.use("/danh-muc-thuoc", require("./danh_muc.route"));
router.use("/don-thuoc", require("./don_thuoc.route"));
router.use("/chi-tiet-don-thuoc", require("./chi_tiet_don_thuoc.route"));
router.use("/chi-tiet-dich-vu", require("./chi_tiet_dich_vu.router"));
router.use("/chuyen-khoa", require("./chuyen_khoa.router"));
router.use("/dich-vu", require("./dich_vu.router"));

module.exports = router;