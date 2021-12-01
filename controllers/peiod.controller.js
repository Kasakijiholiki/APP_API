
const connection = require('../config-db/connection')
const logger = require('../config-log/logger')
let SQL = ``
const process = require('../Processes')
exports.getperiod = async (req, res) => {

    const deviceCode = req.params.deviceCode

    SQL = ` SELECT period_number as periodNumber, to_char("date_bill", 'DD/MM/YYYY') as date, sum(bill_price) as totalPrice
                   FROM  tbl_bill WHERE device_code = $1
                         GROUP BY period_number, date_bill`

    await connection.connect((err, cleint, done) => {
        cleint.query(SQL, [deviceCode], (error, results) => {
            if (error) {
                logger.error(error)
                res.status(403).send({ error: error })
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
    })

}
