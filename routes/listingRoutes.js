import express from "express";
import Listing from "../model/Listing.js";

const router = express.Router();

// GET /listings — fetch all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().lean(); // lean() returns plain JS objects
    console.log("Fetched Listings:", listings);   // Log to verify structure
    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
