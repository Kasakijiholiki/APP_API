const express = require('express')
const app = express();
const cors = require('cors')
let bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//routes
const account = require('./routes/account.route')
const period = require('./routes/period.route')

//use routes
app.use('/api/', account)
app.use('/api/', period)

//Swagger
const PORT = process.env.port || 8000
const option = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "App Lottery API"
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "http",
          scheme: "bearer",
          in: "header",
          bearerFormat: "JWT"
        },
      }
    }
    ,
    security: [{
      jwt: []
    }],
  swagger: "3.0",
    servers: [
      {
        url: `http://49.0.198.122:7000`
        //url: `http://localhost:7000`
      }
    ],
  },

  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJSDoc(option)
app.use('/Swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

let cperiod = require('./morefunction/getcurrentperiod')
let isonline = require('./morefunction/isonline')

isonline.isonline();
cperiod.getcurrentperiod();
console.log(cperiod.getcurrentperiod())

app.listen(PORT, console.log(`Server Running on port ${PORT}`))
module.exports = app;
