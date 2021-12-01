
const express = require('express');
const router = express.Router();
const account = require('../controllers/account.controller')


/**
 * @swagger
 * tags:
 *  name: Account
 *  description: Account api
 */
// Login Companent
/**
 * @swagger
 * components:
 *  schemas:
 *   Login:
 *    type: object
 *    required:
 *      - device_code
 *      - us_pwd
 *    properties:
 *     device_code:
 *      type: string
 *      description: Device code
 *     us_pwd:
 *      type: string
 *      description: Password
 */
//PasswordChange Companent
/**
 * @swagger
 * components:
 *  schemas:
 *   PasswordChange:
 *    type: object
 *    required:
 *      - device_code
 *      - us_pwd
 *      - us_newpwd
 *    properties:
 *     device_code:
 *      type: string
 *      description: Device code
 *     us_pwd:
 *      type: string
 *      description: Old Password
 *     us_newpwd:
 *      type: string
 *      description: New Password
 */

/**
 * @swagger
 * /api/account/login/{device_code}/{us_pwd}:
 *  post:
 *   summary: Logined
 *   tags: [Account]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: Device code
 *      example: 317643
 *    - in: path
 *      name: us_pwd
 *      schema:
 *       type: string
 *      required: true
 *      description: Password
 *      example: 123
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
router.post('/account/login/:device_code/:us_pwd', account.login)

/**
 * @swagger
 * /api/account/userpasswordchange/{device_code}/{us_pwd}/{us_newpwd}:
 *  post:
 *   summary: Password was updated
 *   tags: [Account]
 *   parameters:
 *    - in: path
 *      name: device_code
 *      schema:
 *       type: string
 *      required: true
 *      description: Device code
 *      example: 317643
 *    - in: path
 *      name: us_pwd
 *      schema:
 *       type: string
 *      required: true
 *      description: Old password
 *      example: 123
 *    - in: path
 *      name: us_newpwd
 *      schema:
 *       type: string
 *      required: true
 *      description: New password
 *      example: 123
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
router.post('/account/userpasswordchange/:device_code/:us_pwd/:us_newpwd', account.PasswordChage)

//.................GET.................................................//
/**
 * @swagger
 * /api/account/CheckVersion/{version_name}:
 *  get:
 *   summary: Return true Or false
 *   tags: [Account]
 *   parameters:
 *    - in: path
 *      name: version_name
 *      schema:
 *       type: string
 *      required: true
 *      description: version name
 *      example: 2.0.27
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
router.get('/account/CheckVersion/:version_name', account.checkversion)

/**
 * @swagger
 * /api/account/CheckVersionV2/{version_name}/{device_imei}:
 *  get:
 *   summary: Return true Or false
 *   tags: [Account]
 *   parameters:
 *    - in: path
 *      name: device_imei
 *      schema:
 *       type: string
 *      required: true
 *      description: device imei
 *      example: 863237041347802
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
router.get('/account/CheckVersionV2/:version_name/:device_imei', account.CheckVersionV2)

module.exports = router