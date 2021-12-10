const express = require("express");
const route = express.Router();
const his = require("../controllers/HistorySalePeriod");


route.get("/HistorySalePeriod/get/:deviceCode/:periodNumber", his.get);


module.exports = route