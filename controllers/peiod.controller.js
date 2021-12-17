
const connection = require('../config-db/connection')
const logger = require('../config-log/logger')
let SQL = ``

let deviceCode = ""
exports.getperiod = async (req, res) => {

     deviceCode = req.params.deviceCode

    SQL = ` SELECT period_number as periodNumber, to_char("date_bill", 'DD/MM/YYYY') as date, sum(bill_price) as totalPrice
                   FROM  tbl_bill WHERE device_code = $1
                         GROUP BY period_number, date_bill`

    await connection.connect((err, cleint, done) => {
        if(!err) {
            cleint.query(SQL, [deviceCode], (error, results) => {
                if (error) {
                    logger.error(error)
                    res.status(403).send({ error: error.stack })
                }
    
                if (results.rowCount == 0) {
                    res.status(404).send(false)
                }
                else {
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: 'OK',
                        totalRecords: 0,
                        data: {
                            billDetailList: results.rows
                        }
                    })
                }
            })
            done();
        }
       
    })

}
exports.getperiodv2 = async (req, res) => {
deviceCode = req.params.deviceCode
SQL = `SELECT 
             tbl_bill.period_number AS periodNumber,
             tbl_bill.device_code AS deviceCode, 
             tbl_online.date_offline AS dateOffline
      FROM   tbl_bill, tbl_online
       WHERE tbl_bill.period_number = tbl_online.period_number
       AND   tbl_bill.device_code = $1
    ORDER BY tbl_bill.period_number DESC  `
connection.connect((err, cleint, done) => {
    if(!err) {
        cleint.query(SQL, [deviceCode], (error, results) => {
            if(error) {
                logger.error(error.stack)
                return res.status(403).send({error: error.stack})
            }
            if(results.rowCount == 0) {
                return res.status(404).send({Message: "Not found"})
            }
            else {
                return res.send({
                    status: true,
                    statusCode: 200,
                    message: "OK",
                    totalRecords: 0,
                    data: {
                        billDetailList: [
                            results.rows
                        ]
                    }
                })
            }
        })
        done();
    } else {
        logger.error(err)
        return res.status(500).send("connect db failed")
    }
})
}