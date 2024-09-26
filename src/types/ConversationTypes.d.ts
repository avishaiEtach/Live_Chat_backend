import mongoose from "mongoose";

interface Conversation {
  participants: mongoose.Types.ObjectId[];
  messages: mongoose.Types.ObjectId[];
}

export { Conversation };
