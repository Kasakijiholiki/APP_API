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

var format = require('pg-format');


//routes
const account = require('./routes/account.route')
const period = require('./routes/period.route')
const sale = require('./routes/salemanagement.route')
//use routes
app.use('/api/', account)
app.use('/api/', period)
app.use('/api/', sale)

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
       // url: `http://localhost:8000`
      }
    ],
  },

  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJSDoc(option)
app.use('/Swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

// let cperiod = require('./morefunction/getcurrentperiod')
// let isonline = require('./morefunction/isonline')

// isonline.isonline();
// cperiod.getcurrentperiod();
// console.log(cperiod.getcurrentperiod())
const db = require('./config-db/connection');
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
// const userList = []
// db.connect((err, cleint, done) => {
//   if (!err) {
// for(let i = 0; i < 100000; i++) {
//   userList.push([i, "Firstname"+i, "LastName"+i])
// }
//     cleint.query(format("INSERT INTO demo (id, fname, lname) VALUES %L", userList), [], (error, results) => {
//      if(error) throw error.stack
//      else {
//        console.log("Success")
//      }
      
//       done()
//     });
//    }
//   console.log(userList)
// })

// const a = require('./controllers/salemanagement.controller')

// a.
app.listen(PORT, console.log(`Server Running on port ${PORT}`))
module.exports = app;
