const mongoose = require("mongoose");
const AppError = require("../utility/apperror");
const validator = require("validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [5, "name must be at least 5 characters"],
    maxlength: [40, "name must be at most 40 characters"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    minlength: [10, "email must be at least 10 characters"],
    lowercase: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: "email is invalid",
    },
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "password must be at least 8 characters"],
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value);
      },
    },
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function (value) {
        return this.password === value;
      },
      message: "password and password confirm must be the same",
    },
  },
  passwordChangedAt: Date,
  hashToken: String,
  expiresDate: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const hashPass = await bcrypt.hash(this.password, 12);
  this.password = hashPass;
  this.passwordConfirm = undefined;
});
UserSchema.methods.resetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.hashToken = hashToken;
  this.expiresDate = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("Users", UserSchema);

module.exports = User;
