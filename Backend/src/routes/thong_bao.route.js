const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const thongBaoController = require("../controllers/thong_bao.controller");

router.use(authMiddleware);

router.get("/", thongBaoController.getList);
router.get("/dem", thongBaoController.getUnreadCount);
router.put("/:id/doc", thongBaoController.markRead);
router.put("/doc-tat-ca", thongBaoController.markAllRead);

module.exports = router;
