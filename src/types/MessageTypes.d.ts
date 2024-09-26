import mongoose from "mongoose";

interface Message {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  message: string;
}

export { Message };
