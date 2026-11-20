const { Signup, Login } = require("../Controllers/AuthController");
const { verifyToken } = require("../Middlewares/AuthMiddleware");

const router = require("express").Router();

// Signup
router.post("/signup", Signup);

// Login
router.post("/login", Login);

// Verify authentication
router.get("/verify", verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "User authenticated successfully",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;