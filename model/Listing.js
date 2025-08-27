import mongoose from "mongoose";

// Use a flexible schema to capture all fields
const listingSchema = new mongoose.Schema({}, { strict: false });

const Listing = mongoose.model("Listing", listingSchema, "unified_database_new");

export default Listing;
