const express = require("express");
const router = express.Router();
const controller = require("../controllers/chung_chi.controller");

router.get("/nhan-vien/:id_nhan_vien", controller.getByNhanVien);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
