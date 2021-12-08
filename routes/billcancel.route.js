
const express = require('express')
const route = express.Router()
const billcancel = require('../controllers/billcancel.controller')

/**
 * @swagger
 * tags:
 *  name: BillCancel
 *  description: BillCancel api
 */

/**
 * @swagger
 * /api/CancelBill/get/{deviceCode}:
 *  get:
 *   summary: Get a  bill cancel
 *   tags: [BillCancel]
 *   parameters:
 *    - in: path
 *      name: deviceCode
 *      schema:
 *       type: string
 *      require: true
 *      description: deviceCode
 *   responses:
 *    201:
 *       description: Create
 *    401:
 *       description: Unauthorization
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */
route.get('/CancelBill/get/:deviceCode', billcancel.get)
/**
 * @swagger
 * /api/CancelBill/cancel/add/{deviceCode}/{deviceNumber}/{billId}/{reasonCancel}:
 *  post:
 *   summary: Create a new bill cancel
 *   tags: [BillCancel]
 *   parameters:
 *    - in: path
 *      name: deviceCode
 *      schema:
 *       type: string
 *      require: true
 *      description: deviceCode
 *    - in: path
 *      name: deviceNumber
 *      schema:
 *       type: integer
 *      require: true
 *      description: deviceNumber
 *    - in: path
 *      name: billId
 *      schema:
 *       type: string
 *      require: true
 *      description: billId
 *    - in: path
 *      name: reasonCancel
 *      schema:
 *       type: string
 *      require: true
 *      description: reasonCancel
 *   responses:
 *    201:
 *       description: Create
 *    401:
 *       description: Unauthorization
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */

route.post('/CancelBill/cancel/add/:deviceCode/:deviceNumber/:billId/:reasonCancel', billcancel.billCancel)


module.exports  = route