const express = require("express");
const route = express.Router();
const his = require("../controllers/HistorySalePeriod");




/**
 * @swagger
 * /api/HistorySalePeriod/get/{deviceCode}/{periodNumber}:
 *  get:
 *   tags: [HistorySalePeriod]
 *   parameters:
 *    - in: path
 *      name: deviceCode
 *      schema:
 *       type: string
 *      required: true
 *      description: deviceCode
 *      example: 21818673
 *    - in: path
 *      name: periodNumber
 *      schema:
 *       type: string
 *      required: true
 *      description: periodNumber
 *      example: 21057
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


route.get("/HistorySalePeriod/get/:deviceCode/:periodNumber", his.get);


module.exports = route