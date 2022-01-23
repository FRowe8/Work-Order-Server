const express = require("express");

const jobDetails = require("./jobDetails");
const engDetails = require("./engDetails");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/jobDetails", jobDetails);
router.use("/EngDetails", engDetails);

module.exports = router;
