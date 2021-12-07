const db = require("../config-db/connection");
const logger = require('../config-log/logger')

exports.billlist = (req, res) => {
    totalPrice = 0;
    totalSale = 0;
    device_code = req.params.device_code;
    drawnumber = req.params.drawnumber;
    sql = `SELECT tbl_bill.bill_id AS key,
                  to_char("date_bill", 'DD/MM/YYYY') AS date,
                  tbl_bill.time_bill AS time, 
                  tbl_bill_detail.bill_id AS key,
                  tbl_bill_detail.bill_number AS billNUmber,
                  tbl_bill.bill_price AS billPrice
           FROM   tbl_bill, tbl_bill_detail
           WHERE  tbl_bill.bill_id = tbl_bill_detail.bill_id
           AND    tbl_bill.device_code = $1
           AND    tbl_bill.period_number = $2`;
    db.connect((err, client, done) => {
        if (!err) {
            client.query(sql, [device_code, drawnumber], (error, results) => {
                if (error) {
                    logger.error(error)
                    return res.status(403).send(error.stack);
                }
                if (results.rowCount == 0) {

                    return res.status(404).send('not found');
                }
                else {
                    for (let i = 0; i < results.rowCount; i++) {
                        totalPrice += results.rows[i].billprice;
                    }
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: "OK",
                        totalReords: 0,
                        data: {
                            totalSale: results.rowCount,
                            totalPrice: totalPrice,
                            billlist: results.rows
                        }
                    });

                }
            }
            )
            done()
        }

        else {
            logger.error(err);
            return res.status(500).send('Server error');

        }

    })

}


