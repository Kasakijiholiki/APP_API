
const winston = require('winston')
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({
        filename: 'logs/lottery_app_api.log',
        level: 'error',
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(),winston.format.json()),
       
      })
    ],
    meta: true,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
  })
  module.exports = logger;