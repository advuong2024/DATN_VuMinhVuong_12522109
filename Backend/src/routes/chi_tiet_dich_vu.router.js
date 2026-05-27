const express = require("express");
const router = express.Router();
const controller = require("../controllers/chi_tiet_dich_vu.controller");
const auth = require("../middlewares/auth.middleware");
const requireRole = require("../middlewares/role.middleware");
const { upload } = require("../config/upload");

router.get("/cho-thuc-hien", auth, requireRole("ADMIN", "BAC_SI", "KY_THUAT_VIEN"), controller.getPending);
router.get("/phieu-kham/:id", auth, controller.getByPhieuKham);
router.patch("/:id/ket-qua", auth, requireRole("ADMIN", "BAC_SI", "KY_THUAT_VIEN"), upload.single("file"), controller.updateResult);

router.get("/theo-trang-thai/:trang_thai", auth, controller.getByStatus);
router.patch("/:id/trang-thai", auth, requireRole("ADMIN", "BAC_SI", "KY_THUAT_VIEN"), controller.updateStatus);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;
