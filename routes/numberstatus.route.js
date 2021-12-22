const express = require('express')
const route = express.Router()
const numberstatus = require('../controllers/numberstatusservice.controller')

route.get('/numberstatus/getnumberlist', numberstatus.getnumberList)

module.exports = route