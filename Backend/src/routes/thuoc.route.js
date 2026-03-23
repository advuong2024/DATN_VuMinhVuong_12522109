const express = require("express");
const router = express.Router();
const thuocController = require("../controllers/thuoc.controller");

router.get("/", thuocController.getAll);
router.get("/:id", thuocController.getById);
router.post("/", thuocController.create);
router.put("/:id", thuocController.update);
router.delete("/:id", thuocController.delete);

module.exports = router;