const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { Movie, Director, User } = require("../models");
const { buildMovie } = require("./fixtures/movie");
const { buildUser } = require("./fixtures/user");

describe("/favorites", () => {
  let userToken;
  let adminToken;
  let adminEmail;
  let userEmail;
  let directorId;
  let movieId;
  let movieTitle;

  beforeAll(async () => {
    const admin = buildUser({ roles: ["admin"] });
    adminEmail = admin.email;
    await request(app).post("/users").send(admin);
    const adminLogin = await request(app)
      .post("/auth/login")
      .send({ email: admin.email, password: admin.password });
    adminToken = adminLogin.body.token;

    const user = buildUser();
    userEmail = user.email;
    await request(app).post("/users").send(user);
    const userLogin = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: user.password });
    userToken = userLogin.body.token;

    const director = await Director.create({ name: "Test Director" });
    directorId = director._id.toString();

    const movieFixture = buildMovie({ director: directorId });
    movieTitle = movieFixture.title;
    const movie = await Movie.create(movieFixture);
    movieId = movie._id.toString();
  });

  afterAll(async () => {
    // точечное удаление по id, а не по шаблону title — другой тестовый
    // файл может параллельно работать со своими "Test Movie ..." записями
    await Movie.findByIdAndDelete(movieId);
    await Director.findByIdAndDelete(directorId);
    await User.deleteMany({ email: { $in: [adminEmail, userEmail] } });
    await mongoose.connection.close();
  });

  it("POST /users/favorites/:movieId добавляет фильм в избранное", async () => {
    const { body } = await request(app)
      .post(`/users/favorites/${movieId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(body.favorites).toContain(movieId);
  });

  it("POST /users/favorites/:movieId без аутентификации — 401", async () => {
    await request(app).post(`/users/favorites/${movieId}`).expect(401);
  });

  it("GET /favorites/stats считает избранное по title (только админ)", async () => {
    const { body } = await request(app)
      .get("/favorites/stats")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(body[movieTitle]).toEqual(1);
  });

  it("GET /favorites/stats без прав админа — 403", async () => {
    await request(app)
      .get("/favorites/stats")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);
  });

  it("DELETE /users/favorites/:movieId убирает фильм из избранного", async () => {
    const { body } = await request(app)
      .delete(`/users/favorites/${movieId}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(body.favorites).not.toContain(movieId);
  });
});
