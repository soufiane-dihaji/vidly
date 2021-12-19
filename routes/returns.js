const Joi = require("joi");
const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { Rental } = require("../models/rental");
const { Movie } = require("../models/movie");
const router = express.Router();

router.post("/", [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("rental not found");

  if (rental.dateReturn)
    return res.status(400).send("return already processed");

  rental.return();
  await rental.save();

  await Movie.updateOne(
    { _id: rental.movie._id },
    {
      $inc: {
        numberInStock: 1,
      },
    }
  );

  res.send(rental);
});

function validateReturn(req) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(req);
}

module.exports = router;
