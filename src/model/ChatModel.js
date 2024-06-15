import mongoose from "mongoose";

const chatSchema = mongoose.Schema(
  {
    // chatName: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },
    // isGroupChat: {
    //   type: Boolean,
    //   default: false,
    // },
    // groupAdmin: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    // },

    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      }
    ],
  },
  { timestamps: true }
);
const ChatModel = mongoose.models.Chat || mongoose.model("Chat", chatSchema);

export default ChatModel;
