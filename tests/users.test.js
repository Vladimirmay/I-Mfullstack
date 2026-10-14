const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { buildUser } = require("./fixtures/user");

describe("Users & Auth", () => {
  let registeredUser;

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("POST /users — успешная регистрация", async () => {
    const newUser = buildUser();

    const { body } = await request(app).post("/users").send(newUser).expect(201);

    expect(body.email).toEqual(newUser.email);
    registeredUser = body;
  });

  it("POST /auth/login — успешный логин", async () => {
    const { body } = await request(app)
      .post("/auth/login")
      .send({ email: registeredUser.email })
      .expect(200);

    expect(body.token).toBeDefined();
  });
});
