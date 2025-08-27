import express from "express";
import User from "../model/User.js";

const router = express.Router();

// GET /users — fetch all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
