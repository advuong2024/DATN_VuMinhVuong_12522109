const express = require("express");
const router = express.Router();
const controller = require("../controllers/tai_khoan.controller");

router.patch("/:id/role", controller.updateRole);
router.patch("/:id/status", controller.updateStatus);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;