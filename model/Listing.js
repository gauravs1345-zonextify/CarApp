import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
  _id: {
    type: String, // 👈 This tells Mongoose to treat _id as a string
    required: true
  },
  // ... other fields
});
const Listing = mongoose.model("Listing", listingSchema, "unified_database_new");
export default Listing;
