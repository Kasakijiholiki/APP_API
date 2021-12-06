const express = require("express");
const route = express.Router();
const dashboard = require("../controllers/dashboard");

route.get("/dashboard/cancelbilldetaillist/:bill_id", dashboard.cancelbilldetaillist);
 


module.exports = route;