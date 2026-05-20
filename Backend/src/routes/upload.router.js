const express = require("express");
const router = express.Router();
const { upload } = require("../config/upload");
const controller = require("../controllers/upload.controller");

router.post("/", upload.single("file"), controller.uploadFile);

module.exports = router;
