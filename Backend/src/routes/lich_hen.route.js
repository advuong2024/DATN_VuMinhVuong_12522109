const express = require("express");
const router = express.Router();
const controller = require("../controllers/lich_hen.controller");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.put("/cancel/:id", controller.cancel);
router.delete("/:id", controller.delete);

module.exports = router;