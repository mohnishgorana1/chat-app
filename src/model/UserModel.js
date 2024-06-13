import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      unique: true,
      required: true,
    },
    password: {
      type: "String",
      required: true,
    },
    avatar: {
      public_id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    // isAdmin: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
  },
  { timestaps: true }
);

const UserModel = (mongoose.models.User) || mongoose.model('User', userSchema)

export default UserModel;
