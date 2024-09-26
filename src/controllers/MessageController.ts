import express from "express";
import mongoose from "mongoose";
import { MessageModel } from "../db/models/message";
import { ConversationModel } from "../db/models/conversation";
import { getReceiverSocketId, io } from "../socket/socket";

class MessageController {
  sendMessage = async (req: express.Request, res: express.Response) => {
    try {
      const { message } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user?.id;

      let conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });

      if (!conversation) {
        conversation = await ConversationModel.create({
          participants: [senderId, receiverId],
        });
      }

      const newMessage = new MessageModel({
        senderId,
        receiverId,
        message,
      });

      if (newMessage) {
        conversation.messages.push(newMessage._id);
      }
      await Promise.all([await conversation.save(), await newMessage.save()]);

      const receiverSocketId = getReceiverSocketId(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      return res.status(200).json(newMessage);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
  getMessage = async (req: express.Request, res: express.Response) => {
    try {
      const { id: userToMessage } = req.params;
      const senderId = req.user?.id;
      let conversation = await ConversationModel.findOne({
        participants: { $all: [senderId, userToMessage] },
      }).populate("messages");

      if (!conversation) {
        return res.status(200).json([]);
      }

      const messages = conversation.messages;
      return res.status(200).json(messages);
    } catch (err: any) {
      return res.status(400).send(err.message);
    }
  };
}

export default new MessageController();
