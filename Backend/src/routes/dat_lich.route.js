const express = require("express");
const router = express.Router();
const controller = require("../controllers/dat_lich.controller");
const verifyToken = require("../middlewares/auth.middleware");

router.get("/:id/can-book", controller.canBook)
router.post("/them-lich", controller.createBooking);
router.patch("/:id/status", controller.updateStatus);
router.get("/da-dat", controller.getBooked);
router.get("/", controller.getAll);
router.get("/da-den", verifyToken, controller.getAllDaDen);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;