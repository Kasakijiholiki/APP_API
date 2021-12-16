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
const sale = require('./routes/salemanagement.route')
const billcancel = require('./routes/billcancel.route')
const dashboard = require('./routes/dashboard')

const His = require('./routes/HistorySalePeriod')
//use routes
app.use('/api/', account)
app.use('/api/', period)
app.use('/api/', sale)
app.use('/api/', dashboard);
app.use('/api/', billcancel)
app.use('/api/', His)


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
<<<<<<< HEAD
=======
<<<<<<< HEAD
        // url: `http://49.0.198.122:7000`
       url: `http://localhost:8000`
       
      }

=======
<<<<<<< HEAD
>>>>>>> ce51b3b872568ed4cdc4d6519adb68a7bdcc7a25
        url: `http://49.0.198.122:7000`
       
      }
<<<<<<< HEAD
=======
=======
       //  url: `http://49.0.198.122:7000`
      url: `http://localhost:8000`
>>>>>>> f671cc389f405fb9c61c61ac80d47182a3b5d01b
         //url: `http://49.0.198.122:7000`    
          }
>>>>>>> e3e4efca02e69d54fd2d28eadec419b8bc7e4e48
>>>>>>> 65ca53a37b8c59491d75519e0f567605f9a91839
>>>>>>> ce51b3b872568ed4cdc4d6519adb68a7bdcc7a25
    ],
  },

  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJSDoc(option)
app.use('/Swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))




<<<<<<< HEAD
app.get('/', (req, res) => {

  let ab = req.params
=======

>>>>>>> ce51b3b872568ed4cdc4d6519adb68a7bdcc7a25


app.listen(PORT, console.log(`Server Running on port ${PORT}`))
module.exports = app;
