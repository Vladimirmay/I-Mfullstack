const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { User, Chat } = require("../models");
const { buildUser } = require("./fixtures/user");
const { buildChat } = require("./fixtures/chat");

describe("/chats", () => {
  let token;
  let userId;
  let secondUserId;
  let chatId;

  beforeAll(async () => {
    const user = await User.create({ ...buildUser(), token: "test-token-1" });
    userId = user._id.toString();
    token = user.token;

    const secondUser = await User.create({ ...buildUser(), token: "test-token-2" });
    secondUserId = secondUser._id.toString();
  });

  afterAll(async () => {
    await Chat.findByIdAndDelete(chatId);
    await User.deleteMany({ _id: { $in: [userId, secondUserId] } });
    await mongoose.connection.close();
  });

  it("POST /chats — создание чата", async () => {
    const newChat = buildChat();

    const { body } = await request(app)
      .post("/chats")
      .set("Authorization", `Bearer ${token}`)
      .send(newChat)
      .expect(201);

    expect(body.title).toEqual(newChat.title);
    chatId = body._id;
  });

  it("GET /chats — список чатов текущего пользователя", async () => {
    const { body } = await request(app)
      .get("/chats")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(body)).toBe(true);
  });

  it("GET /chats/:chatId — получение конкретного чата", async () => {
    const { body } = await request(app)
      .get(`/chats/${chatId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(body._id).toEqual(chatId);
  });

  it("POST /chats/:chatId/users — добавление участника в чат", async () => {
    const { body } = await request(app)
      .post(`/chats/${chatId}/users`)
      .set("Authorization", `Bearer ${token}`)
      .send({ userId: secondUserId })
      .expect(200);

    expect(body.users).toContain(secondUserId);
  });

  it("DELETE /chats/:chatId/users/:userId — удаление участника из чата", async () => {
    const { body } = await request(app)
      .delete(`/chats/${chatId}/users/${secondUserId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(body.users).not.toContain(secondUserId);
  });

  it("DELETE /chats/:chatId/leave — выход из чата", async () => {
    await request(app)
      .delete(`/chats/${chatId}/leave`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });
});
