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
         url: `http://49.0.198.122:7000`
      // url: `http://localhost:8000`
       
      }
    ],
  },

  apis: ['./routes/*.js']
}
const swaggerDocs = swaggerJSDoc(option)
app.use('/Swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs))


app.get('/', async (req,res) => {
  const cleint  = await db.connect()
  const curentPeriod = (await cleint.query(`SELECT period_number FROM tbl_online WHERE  online_status = 1`)).rows[0].period_number
// if(curentPeriod != 0 || curentPeriod != null || curentPeriod != "") {
//   return res.send(curentPeriod)
// } else {
//   return res.send("Offline")
// }
// console.log("OK")
// const lotteryList = (await cleint.query(`SELECT lottery_number, lottery_price FROM tbl_bill_detail`)).rows
// return res.send(lotteryList)
let num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0

const quotaList = (await (cleint.query(`SELECT digit_lenght, price_per_number FROM tbl_quota`))).rows
for(let i = 0; i < quotaList.length; i++){
 if(quotaList[i].digit_lenght == 1) {
  num1 = 1
  console.log("number1 "+num1)
 }
 else if(quotaList[i].digit_lenght == 2) {
  num2 = 2
  console.log("number3 "+num2)
 }
 else if(quotaList[i].digit_lenght == 3) {
  num3 = 3
  console.log("number4 "+num3)
 }


}
})

// const i = [
//   [922852,1000], 
//   [922852, 1000], 
//   [922852, 1000], 
//   [ 922852,1000]]

//   const saleViewModelList = {
//     "periodNumber": 1010,
//     "SaleList":
//     [{"lotteryNumber": 922852, "lotteryPrice": 1000}, 
//     {"lotteryNumber": 922852, "lotteryPrice": 2000}, 
//     {"lotteryNumber": 922852, "lotteryPrice": 3000}, 
//     {"lotteryNumber": 922852, "lotteryPrice": 4000}, 
//     {"lotteryNumber": 922852, "lotteryPrice": 5000}
//     ]
//     }

//   let SaleList = []
//   for (let i = 0; i < saleViewModelList.SaleList.length; i++) {
//     SaleList.push([1, 2, saleViewModelList.SaleList[i].lotteryNumber, saleViewModelList.SaleList[i].lotteryPrice])
// }

// SaleList.splice(2, 1)




app.get('/', (req, res) => {

  let ab = req.params

  return res.send(ab)
})

app.listen(PORT, console.log(`Server Running on port ${PORT}`))
module.exports = app;
