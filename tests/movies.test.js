const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { Movie, Director, User } = require("../models");
const { buildMovie } = require("./fixtures/movie");
const { buildUser } = require("./fixtures/user");

describe("/movies", () => {
  let token;
  let directorId;
  let movieId;
  let movieFixture;
  let adminEmail;

  beforeAll(async () => {
    // регистрируем настоящего админа и логинимся — реальный токен,
    // без комментирования passport.authenticate/requireAdmin в роутах
    const admin = buildUser({ roles: ["admin"] });
    adminEmail = admin.email;

    await request(app).post("/users").send(admin);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: admin.email, password: admin.password });

    token = loginRes.body.token;

    const director = await Director.create({ name: "Test Director" });
    directorId = director._id.toString();

    // фильм для GET/PATCH/DELETE создаём напрямую через модель,
    // так как POST /movies не возвращает тело созданного фильма
    movieFixture = buildMovie({ director: directorId });
    const movie = await Movie.create(movieFixture);
    movieId = movie._id.toString();
  });

  afterAll(async () => {
    // точечное удаление по id, а не по шаблону title — другой тестовый
    // файл может параллельно работать со своими "Test Movie ..." записями
    await Movie.findByIdAndDelete(movieId);
    await Director.findByIdAndDelete(directorId);
    await User.deleteOne({ email: adminEmail });
    await mongoose.connection.close();
  });

  it("POST /movies создаёт фильм", async () => {
    const newMovie = buildMovie({ director: directorId });

    await request(app)
      .post("/movies")
      .set("Authorization", `Bearer ${token}`)
      .send(newMovie)
      .expect(201);

    // POST /movies не возвращает тело созданного фильма, поэтому находим
    // и сразу подчищаем его в рамках этого же теста
    const created = await Movie.findOne({ title: newMovie.title });
    expect(created).not.toBeNull();
    await Movie.findByIdAndDelete(created._id);
  });

  it("GET /movies возвращает список фильмов", async () => {
    const { body } = await request(app).get("/movies").expect(200);
    expect(Array.isArray(body)).toBe(true);
  });

  it("GET /movies не вызывает console.log", async () => {
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    await request(app).get("/movies").expect(200);

    expect(logSpy).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it("GET /movies/:movieId возвращает конкретный фильм", async () => {
    const { body } = await request(app).get(`/movies/${movieId}`).expect(200);
    expect(body.title).toEqual(movieFixture.title);
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
    const badMovie = buildMovie();

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
