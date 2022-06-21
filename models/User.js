import mongoose from "mongoose";

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
    select: false,
  },
  refreshToken: String
});

export default mongoose.model("User", UserSchema);
