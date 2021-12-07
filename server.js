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
//use routes
app.use('/api/', account)
app.use('/api/', period)
app.use('/api/', sale)
const dashboard = require('./routes/dashboard')


//use routes
app.use('/api/', account)
app.use('/api/', period)
app.use('/api/', dashboard);

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
        // url: `http://49.0.198.122:7000`
       url: `http://localhost:8000`
      }
    ],
  },

  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJSDoc(option)
app.use('/Swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

<<<<<<< HEAD
=======
// let cperiod = require('./morefunction/getcurrentperiod')
 let isonline = require('./morefunction/isonline')

  isonline.isonline().then((result) => {
    console.log(result)
  //  if(result) {
  //    console.log("OK")
  //  }
  })





// cperiod.getcurrentperiod();
// console.log(cperiod.getcurrentperiod())
// let user = {}
// db.connect((err, cleint, done) => {
//   if (!err) {

//     cleint.query(`SELECT * FROM tbl_user_seller WHERE device_code = '1111111'`, "", (error, results) => {
//       if (!error && results.rowCount > 0) {
//         user = results.rows[0]
       
//       }
//       console.log(user)
//       done()
//     });
//   }
  
// })

<<<<<<< HEAD
=======
// a.
>>>>>>> 66e64b3f8dc078109393fd56385efd9d7a1ffe8f
>>>>>>> 707e411f554b73d6b0d815113179af73d0d888c5
app.listen(PORT, console.log(`Server Running on port ${PORT}`))
module.exports = app;
