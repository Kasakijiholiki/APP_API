const express = require("express");
const route = express.Router();
const dashboard = require("../controllers/dashboard");

route.get("/dashboard/cancelbilldetaillist/:bill_id", dashboard.cancelbilldetaillist);
route.get("/dashboard/cancelbilllist/:device_code/:drawnumber", dashboard.cancelbilllist);
module.exports = route;