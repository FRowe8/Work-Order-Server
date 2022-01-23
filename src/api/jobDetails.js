const express = require("express");
const Joi = require("joi");
const { Pool, Client } = require("pg");

const router = express.Router();

const schema = Joi.object().keys({
  site: Joi.string().min(1).max(500).required(),
  description: Joi.string().min(1).max(500).required(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required(),
});

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: {
    rejectUnauthorized: false,
  },
});

// pools will use environment variables
// for connection information
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

router.get("/", (req, res) => {
  (async () => {
    pool.connect((err, client, release) => {
      if (err) {
        return res.status(503).json("Error acquiring client", err.stack);
      }
      client.query(`Select * from customers`, (err, result) => {
        release();
        if (err) {
          return res.status(500).json("Error executing query", err.stack);
        }
        return res.status(200).json(result.rows);
      });
    });
  })().catch((err) =>
    setImmediate(() => {
      throw err;
    })
  );
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
