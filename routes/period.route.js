const express = require('express')
const router = express.Router();
const period_number = require('../controllers/peiod.controller')


/**
 * @swagger
 * tags:
 *  name: Period
 *  description: Period api
 */

/**
 * @swagger
 * /api/period/get/{deviceCode}:
 *  get:
 *   summary: Return a list of period
 *   tags: [Period]
 *   parameters:
 *    - in: path
 *      name: deviceCode
 *      schema:
 *       type: string
 *      required: true
 *      description: Device code
 *      example: 317643
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
router.get('/period/get/:deviceCode', period_number.getperiod)

module.exports = router