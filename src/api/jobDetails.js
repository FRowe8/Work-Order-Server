const express = require("express");
const Joi = require("joi");

const Redis = require("ioredis");

const redis = new Redis({
  port: "15953",
  host: "redis-15953.c293.eu-central-1-1.ec2.cloud.redislabs.com",
  password: process.env.REDIS_PASSWORD,
});

const router = express.Router();

const schema = Joi.object().keys({
  site: Joi.string().alphanum().min(1).max(100).required(),
  description: Joi.string().alphanum().min(1).max(500).required,
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

router.get("/", (req, res) => {
  res.json([]);
});

router.post("/", (req, res, next) => {
  const result = Joi.validate(req.body, schema);
  if (result.error === null) {
    const { site, description, latitude, longitude } = req.body;
    const jobDetails = {
      site,
      description,
      latitude,
      longitude,
      date: new Date(),
    };
    //add code
    // add current time
    // insert into DB
    res.json([]);
  } else {
    next(result.error);
  }
});

module.exports = router;
