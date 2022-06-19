import mongoose from 'mongoose'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
  forename: {
    type: String,
    required: [true, "Firstname is required"],
    trim: true,
  },
  surname: {
    type: String,
    required: [true, "Surname is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    trim: true,
    minlength: 8,
    select:false
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.createJWT = function () {
  return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn: process.env.JWT_TIME})
}

export default mongoose.model('User', UserSchema)