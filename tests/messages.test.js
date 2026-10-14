const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { User, Chat, Message } = require("../models");
const { buildUser } = require("./fixtures/user");
const { buildChat } = require("./fixtures/chat");
const { buildMessage } = require("./fixtures/message");

describe("/chats/:chatId/messages", () => {
  let token;
  let userId;
  let chatId;

  beforeAll(async () => {
    const user = await User.create({ ...buildUser(), token: "test-token-msg" });
    userId = user._id.toString();
    token = user.token;

    const chat = await Chat.create({ ...buildChat(), users: [userId] });
    chatId = chat._id.toString();
  });

  afterAll(async () => {
    await Message.deleteMany({ chatId });
    await Chat.findByIdAndDelete(chatId);
    await User.findByIdAndDelete(userId);
    await mongoose.connection.close();
  });

  it("POST /chats/:chatId/messages — отправка сообщения в чат", async () => {
    const newMessage = buildMessage();

    const { body } = await request(app)
      .post(`/chats/${chatId}/messages`)
      .set("Authorization", `Bearer ${token}`)
      .send(newMessage)
      .expect(201);

    expect(body.text).toEqual(newMessage.text);
  });

  it("GET /chats/:chatId/messages — получение истории сообщений чата", async () => {
    const { body } = await request(app)
      .get(`/chats/${chatId}/messages`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(body)).toBe(true);
  });
});
