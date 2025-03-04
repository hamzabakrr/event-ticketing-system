const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: "" },
  password: { type: String, required: true },
  role: { type: String, enum: ["Standard User", "Organizer", "System Admin"], default: "Standard User" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);