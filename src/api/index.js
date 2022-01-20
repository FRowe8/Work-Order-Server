const express = require("express");

const jobDetails = require("./jobDetails");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/jobDetails", jobDetails);

module.exports = router;
