const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  otp: { type: String }, // Field to store OTP
  otpExpires: { type: Date }, // Field to store OTP expiration time
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
