
const express  = require('express')
const route = express.Router()
const sale = require('../controllers/salemanagement.controller')

/**
 * @swagger
 * tags:
 *  name: SaleManagement
 *  description: SaleManagement api
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   sale:
 *    type: object
 *    required:
 *      - deviceCode
 *      - billnumber
 *      - periodNumber
 *      - saleList
 *    properties:
 *     deviceCode:
 *      type: string
 *      description: Device code
 *     billnumber:
 *      type: string
 *      description: Bill number
 *     periodNumber:
 *      type: string
 *      description: Period number
 *     saleList:
 *      type: array
 *      description: Sale list
 * 
 */

/**
 * @swagger
 * /api/SaleManagement/addv2/sale/{deviceCode}/{deviceNumber}:
 *  post:
 *   summary: Add sale
 *   tags: [SaleManagement]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/sale'
 *   parameters:
 *    - in: path
 *      name: deviceCode
 *      schema:
 *       type: string
 *      required: true
 *      description: Device code
 *    - in: path
 *      name: deviceNumber
 *      schema:
 *       type: string
 *      required: true
 *      description: Device number
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
route.post('/salemanagement/addv2/sale/:deviceCode/:deviceNumber', sale.createsale)
/**
 * @swagger
 * /api/salemanagement/getconfigdata:
 *  get:
 *   summary: Get the random 
 *   tags: [SaleManagement]
 *   responses:
 *    200:
 *       description: OK
 *    401:
 *       description: Unauthorization
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */
 route.get('/salemanagement/getconfigdata', sale.getconfigdata)
 /**
 * @swagger
 * /api/salemanagement/getdrawnumber:
 *  get:
 *   summary: Get the draw number 
 *   tags: [SaleManagement]
 *   responses:
 *    200:
 *       description: OK
 *    401:
 *       description: Unauthorization
 *    403:
 *       description: Forbiden
 *    404:
 *       description: Not found
 *    500:
 *       description: Some server error
 */
  route.get('/salemanagement/getdrawnumber', sale.getCurrentperiodnumber)

/**
 * @swagger
 * /api/SaleManagement/GetSellSetNumber/{lotteryNumber}/{lotteryPrice}:
 *  get:
 *   tags: [SaleManagement]
 *   parameters:
 *    - in: path
 *      name: lotteryNumber
 *      schema:
 *       type: string
 *      required: true
 *      description: lotteryNumber
 *      example: 5
 *    - in: path
 *      name: lotteryPrice
 *      schema:
 *       type: string
 *      required: true
 *      description: lotteryPrice
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
 route.get('/salemanagement/GetSellSetNumber/:lotteryNumber/:lotteryPrice', sale.GetSellSetNumber)
module.exports = route