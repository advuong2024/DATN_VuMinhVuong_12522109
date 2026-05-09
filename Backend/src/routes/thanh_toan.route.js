const express = require("express");
const router = express.Router();
const controller = require("../controllers/thanh_toan.controller");

router.put("/pay", controller.pay);
router.get("/:id/details", controller.getPaymentDetail);
router.get("/trang-thai", controller.getStatus);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.insert);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;