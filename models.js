const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: String,
  username: String,
  token: String,
  chats: [{ type: "ObjectId", ref: "Chat" }],
});

const ChatSchema = new Schema({
  title: String,
  users: [{ type: "ObjectId", ref: "User" }],
});

const MessageSchema = new Schema({
  user: { type: "ObjectId", ref: "User" },
  text: String,
  chatId: { type: "ObjectId", ref: "Chat" },
});

const User = model("User", UserSchema);
const Chat = model("Chat", ChatSchema);
const Message = model("Message", MessageSchema);

module.exports = {
  UserSchema,
  ChatSchema,
  MessageSchema,
  User,
  Chat,
  Message,
};
