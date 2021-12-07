const express = require("express");
const route = express.Router();
const dashboard = require("../controllers/dashboard");

/**
 * @swagger
 * tags:
 *  name: Dashboard
 *  description: Dashboard api
 */


/**
 * @swagger
 * /api/Dashbaord/get/cancelbilldetaillist/{bill_id}:
 *  get:
 *   tags: [Dashboard]
 *   parameters:
 *    - in: path
 *      name: bill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: bill_id
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 * 
 */
route.get("/dashboard/get/cancelbilldetaillist/:bill_id", dashboard.cancelbilldetaillist);


/**
 * @swagger
 * /api/Dashbord/get/cancelbilllist/{device_code}/{drawnumber}:
 *  get:
 *   tags: [Dashboard]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: Device code
 *    - in: path
 *      name: drawnumber
 *      schema:
 *       type: string
 *      required: true
 *      description: Drawnumber
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 * 
 */
route.get("/dashboard/get/cancelbilllist/:device_code/:drawnumber", dashboard.cancelbilllist);

/**
 * @swagger
 * /api/Dashbord/get/billdetaillist/{bill_id}:
 *  get:
 *   tags: [Dashboard]
 *   parameters:
 *    - in: path
 *      name: bill_id
 *      schema:
 *       type: string
 *      required: true
 *      description: bill id
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 * 
 */
route.get("/dashboard/get/billdetaillist/:bill_id", dashboard.billdetaillist);


/**
 * @swagger
 * /api/dashboard/get/billlist/{device_code}/{drawnumber}:
 *  get:
 *   tags: [Dashboard]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: Device code
 *    - in: path
 *      name: drawnumber
 *      schema:
 *       type: string
 *      required: true
 *      description: Drawnumber
 *   responses:
 *    200:
 *       description: OK
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 * 
 */
route.get("/dashboard/get/billlist/:device_code/:drawnumber", dashboard.billlist);



module.exports = route;



