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

// const pool = new Pool({
//   user: "dbadmin@trakm8",
//   host: "trakm8.postgres.database.azure.com",
//   max: 20,
//   idleTimeoutMillis: 30000,
//   connectionTimeoutMillis: 2000,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// pools will use environment variables
// for connection information
const client = new Client({
  user: process.env.ENGDBUSER,
  host: process.env.ENGDBHOST,
  database: process.env.ENGDB,
  password: process.env.ENGPASS,
  port: process.env.ENGPORT,
  ssl: {
    rejectUnauthorized: false,
    required: true,
  },
});

let finalObject = [];
const buildJsonData = async function (data) {
  data.forEach((item) => {
    const { lastlocation } = item;
    const data = lastlocation.split(",");

    const vehicleDataObj = {
      id: data[14],
      vehicle: data[1],
      VRN: data[2],
      latitude: data[3],
      longitude: data[4],
      time: data[5],
      received_time: data[6],
      fix_gps: data[7],
      heading: data[8],
      speed: data[9],
      street: data[10],
      town: data[11],
      postcode: data[12],
      vis_satellites: data[13],
      make: data[15],
    };
    finalObject.push(vehicleDataObj);
  });
};

router.get("/", (req, res) => {
  (async () => {
    client.connect((err) => {
      if (err) {
        return res.status(503).json("Error acquiring client", err.stack);
      }
      client.query(`Select public.lastlocation()`, async (err, result) => {
        if (err) {
          return res.status(500).json("Error executing query", err.stack);
        }
        finalObject = [];
        await buildJsonData(result.rows);

        return res.status(200).json(finalObject);
      });
    });
  })().catch((err) =>
    setImmediate(() => {
      throw err;
    })
  );
});

// router.post("/", (req, res, next) => {
//   const result = schema.validate(req.body);
//   if (!result.error) {
//     const { site, description, latitude, longitude } = req.body;
//     const jobDetails = {
//       site,
//       description,
//       latitude,
//       longitude,
//       date: new Date(),
//     };
//     //add code
//     // add current time
//     // insert into redis store

//     redis.set("workOrderData", JSON.stringify(jobDetails));
//     res.json([result]);
//   } else {
//     next(result.error);
//   }
// });

module.exports = router;
