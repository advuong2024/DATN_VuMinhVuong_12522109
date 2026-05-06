const express = require("express");
const router = express.Router();
const controller = require("../controllers/phieu_kham.controller");

router.get("/patient/:id", controller.getMedicalHistoriesByPatient);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;