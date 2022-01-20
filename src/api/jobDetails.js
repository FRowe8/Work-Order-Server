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
  site: Joi.string().min(1).max(500).required(),
  description: Joi.string().min(1).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

const getWorkOrderData = async () => {
  let cacheEntry = await redis.get("workOrderData");
  // check if we have cached value in redis

  // if there is a match then return the cache

  if (cacheEntry) {
    cacheEntry = JSON.parse(cacheEntry);
  }

  //otherwise we need to trigger a call to the database
  return { ...cacheEntry };
};

router.get("/", (req, res) => {
  const result = getWorkOrderData()
    .then((response) => response)
    .then((data) => data);
  res.json(result);
});

router.post("/", (req, res, next) => {
  const result = schema.validate(req.body);
  if (!result.error) {
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
    // insert into redis store

    redis.set("workOrderData", JSON.stringify(jobDetails));
    res.json([result]);
  } else {
    next(result.error);
  }
});

module.exports = router;
