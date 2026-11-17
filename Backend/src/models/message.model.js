import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "ai"],
    },
  },
  { timestamps: true },
);

messageSchema.index({ chat: 1, createdAt: 1 });

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;
