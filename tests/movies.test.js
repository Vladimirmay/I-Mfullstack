const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { Movie, Director, User } = require("../models");

describe("/movies", () => {
  let token;
  let directorId;
  let movieId;

  const testAdminEmail = `admin_${Date.now()}@example.com`;
  const testAdminPassword = "TestPassword123";

  beforeAll(async () => {
    // регистрируем настоящего админа и логинимся — реальный токен,
    // без комментирования passport.authenticate/requireAdmin в роутах
    await request(app).post("/users").send({
      email: testAdminEmail,
      password: testAdminPassword,
      username: "test-admin",
      roles: ["admin"],
    });

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: testAdminEmail, password: testAdminPassword });

    token = loginRes.body.token;

    const director = await Director.create({ name: "Test Director" });
    directorId = director._id.toString();

    // фильм для GET/PATCH/DELETE создаём напрямую через модель,
    // так как POST /movies не возвращает тело созданного фильма
    const movie = await Movie.create({
      title: "Test Movie",
      year: 1994,
      director: directorId,
    });
    movieId = movie._id.toString();
  });

  afterAll(async () => {
    await Movie.deleteMany({ title: /^Test Movie/ });
    await Director.findByIdAndDelete(directorId);
    await User.deleteOne({ email: testAdminEmail });
    await mongoose.connection.close();
  });

  it("POST /movies создаёт фильм", async () => {
    const newMovie = {
      title: "Test Movie POST",
      year: 2001,
      director: directorId,
    };

    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(newMovie)
      .expect(201);
  });

  it("GET /movies возвращает список фильмов", async () => {
    const { body } = await request(app).get("/movies").expect(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET /movies/:movieId возвращает конкретный фильм", async () => {
    const { body } = await request(app).get(`/movies/${movieId}`).expect(200);
    expect(body.title).toEqual("Test Movie");
  });

  it("PATCH /movies/:movieId обновляет фильм", async () => {
    const { body } = await request(app)
      .patch(`/movies/${movieId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Movie Updated" })
      .expect(200);
    expect(body.title).toEqual("Test Movie Updated");
  });

  it("DELETE /movies/:movieId удаляет фильм", async () => {
    await request(app)
      .delete(`/movies/${movieId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  it("POST /movies без обязательного поля director возвращает 400", async () => {
    const badMovie = { title: "No Director Movie", year: 2020 };

    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(badMovie)
      .expect(400);
  });

  it("GET /movies/:movieId с невалидным id возвращает 400", async () => {
    await request(app).get("/movies/not-a-valid-id").expect(400);
  });
});
