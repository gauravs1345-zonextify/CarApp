import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  country: String,
  sellerType: {
    type: String,
    enum: ["Dealer", "Private"],
    default: "Private"
  }
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");

export default User;
