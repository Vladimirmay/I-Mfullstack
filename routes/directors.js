const express = require("express");
const {
  createDirector,
  getDirectors,
  getDirector,
  updateDirector,
  deleteDirector,
} = require("../services/directorsService");
const { handleValidationErrors, asyncHandler } = require("../utils/validationError");
const { body, param } = require("express-validator");

const router = express.Router();

const createDirectorHandler = asyncHandler(async (req, res) => {
  await createDirector(req.body);
  return res.status(201).send("director created");
});

const getDirectorsHandler = asyncHandler(async (req, res) => {
  const directors = await getDirectors();
  return res.status(200).send(directors);
});

const getDirectorHandler = asyncHandler(async (req, res) => {
  const director = await getDirector(req.params.directorId);

  if (!director) {
    return res.status(404).send("director not found");
  }
  return res.status(200).send(director);
});

const updateDirectorHandler = asyncHandler(async (req, res) => {
  const updatedDirector = await updateDirector(req.params.directorId, req.body, {
    new: true,
  });

  if (!updatedDirector) {
    return res.status(404).send("director not found");
  }

  return res.status(200).send(updatedDirector);
});

const deleteDirectorHandler = asyncHandler(async (req, res) => {
  const deletedDirector = await deleteDirector(req.params.directorId);

  if (!deletedDirector) {
    return res.status(404).send("director not found");
  }
  return res.status(204).send();
});

const directorValidationRules = {
  post: [body("name").notEmpty()],
  put: [param("directorId").isMongoId(), body("name").optional().notEmpty()],
  get: param("directorId").isMongoId(),
  delete: param("directorId").isMongoId(),
};

router.post(
  "/directors",
  directorValidationRules.post,
  handleValidationErrors,
  createDirectorHandler,
);

router.get("/directors", getDirectorsHandler);

router.get(
  "/directors/:directorId",
  directorValidationRules.get,
  handleValidationErrors,
  getDirectorHandler,
);

router.put(
  "/directors/:directorId",
  directorValidationRules.put,
  handleValidationErrors,
  updateDirectorHandler,
);

router.delete(
  "/directors/:directorId",
  directorValidationRules.delete,
  handleValidationErrors,
  deleteDirectorHandler,
);

module.exports = router;
