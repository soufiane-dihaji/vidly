const express = require("express");
const { Genre, validate } = require("../models/genre");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validatObjectId = require("../middlewares/validatObjectId");
const router = express.Router();

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });
  await genre.save();

  res.send(genre);
});

router.put("/:id", [auth, validatObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { $set: { name: req.body.name } },
    { new: true }
  );

  if (!genre)
    return res.status(404).send("there is no genre with this given id");

  res.send(genre);
});

router.delete("/:id", [auth, admin, validatObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("there is no genre with this given id");

  res.send(genre);
});

router.get("/:id", validatObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("there is no genre with this given id");

  res.send(genre);
});

module.exports = router;
