const express = require("express");
const route = express.Router();
const dashboard = require("../controllers/dashboard");


route.get("/dashboard/get/cancelbilldetaillist/:bill_id", dashboard.cancelbilldetaillist);

route.get("/dashboard/get/cancelbilllist/:device_code/:drawnumber", dashboard.cancelbilllist);

route.get("/dashboard/get/billdetaillist/:bill_id", dashboard.billdetaillist);

route.get("/dashboard/get/billlist/:device_code/:drawnumber", dashboard.billlist);

//route.get("/dashboard/get/:device_code/:drawnumber", dashboard.get);



module.exports = route;



