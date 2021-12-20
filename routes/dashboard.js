const express = require("express");
const route = express.Router();
const dashboard = require("../controllers/dashboard");


/**
 * @swagger
 * /api/dashboard/get/cancelbilldetaillist/{bill_id}:
 *  get:
 *   tags: [Dasboard]
 *   parameters:
 *    - in: path
 *      name: bill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: bill_id
 *      example: 2f6d9ff4-15a1-4bf9-bf99-abba9f40d049
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */

route.get("/dashboard/get/cancelbilldetaillist/:bill_id", dashboard.cancelbilldetaillist);


/**
 * @swagger
 * /api/dashboard/get/cancelbilllist/{device_code}/{drawnumber}:
 *  get:
 *   tags: [Dasboard]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: device_code
 *      example: 10
 *    - in: path
 *      name: drawnumber
 *      schema:
 *       type: string
 *      required: true
 *      description: drawnumber
 *      example: 1010
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */

route.get("/dashboard/get/cancelbilllist/:device_code/:drawnumber", dashboard.cancelbilllist);

/**
 * @swagger
 * /api/dashboard/get/billdetaillist/{bill_id}:
 *  get:
 *   tags: [Dasboard]
 *   parameters:
 *    - in: path
 *      name: bill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: bill_id
 *      example: eb810ee0-9cfe-43fc-8bdb-1d356e6f5907
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */

route.get("/dashboard/get/billdetaillist/:bill_id", dashboard.billdetaillist);

//route.get("/dashboard/get/:device_code/:drawnumber", dashboard.get);



/**
 * @swagger
 * /api/dashboard/get/billlist/{deviceCode}/{drawNumber}:
 *  get:
 *   tags: [Dasboard]
 *   parameters:
 *    - in: path
 *      name: deviceCode
 *      schema:
 *       type: string
 *      required: true
 *      description: deviceCode
 *      example: 10
 *    - in: path
 *      name: drawNumber
 *      schema:
 *       type: string
 *      required: true
 *      description: drawNumber
 *      example: 1010
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */

route.get("/dashboard/get/billlist/:deviceCode/:drawNumber", dashboard.billlist);

// route.get("/dashboard/get/:device_code/:drawnumber", dashboard.get);

/**
 * @swagger
 * /api/dashboard/get/{device_code}/{drawNumber}:
 *  get:
 *   tags: [Dasboard]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: device_code
 *      example: 10
 *    - in: path
 *      name: drawNumber
 *      schema:
 *       type: string
 *      required: true
 *      description: drawNumber
 *      example: 1010
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */

 route.get("/dashboard/get/:device_code/:drawNumber", dashboard.get);


// route.get("/dashboard/get/:device_code/:drawnumber", dashboard.get);



/**
 * @swagger
 * /api/dashboard/get/billdetaillistbydigit/{device_code}/{drawNumber}/{digit}:
 *  get:
 *   tags: [Dasboard]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: device_code
 *      example: 1234567
 *    - in: path
 *      name: drawNumber
 *      schema:
 *       type: string
 *      required: true
 *      description: drawNumber
 *      example: 1010
 *    - in: path
 *      name: digit
 *      schema:
 *       type: string
 *      required: true
 *      description: Digit
 *      example: 5
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */
 route.get("/dashboard/get/billdetaillistbydigit/:device_code/:drawNumber/:digit", dashboard.billdetaillistbydigit);


 module.exports = route;