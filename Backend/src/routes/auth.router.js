const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.patch("/reset-password/:id", authController.resetPassword);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);

// test phân quyền
// router.get(
//   "/admin",
//   authMiddleware.verifyToken,
//   authMiddleware.authorizeRole(["ADMIN"]),
//   (req, res) => {
//     res.json({ message: "Chỉ ADMIN mới vào được" });
//   }
// );

// router.get(
//   "/staff",
//   authMiddleware.verifyToken,
//   authMiddleware.authorizeRole(["ADMIN", "NHANVIEN"]),
//   (req, res) => {
//     res.json({ message: "ADMIN + NHANVIEN vào được" });
//   }
// );

module.exports = router;