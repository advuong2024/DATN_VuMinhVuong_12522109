const express = require("express");
const router = express.Router();
const controller = require("../controllers/nhan_vien.controller");

router.get("/chua-co-tai-khoan", controller.getNhanVienChuaCoTK);
router.get("/bac-si/:id", controller.getBacSiByChuyenKhoa);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;