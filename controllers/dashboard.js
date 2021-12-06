
const db = require("../config-db/connection");
let bill_id, device_code, drawnumber, totalPrice, totalSale, sql, totalReords;
const logger = require('../config-log/logger')

exports.cancelbilllist = (req, res) => {
    totalPrice = 0;
    totalSale = 0;
    device_code = req.params.device_code;
    drawnumber = req.params.drawnumber;
    sql = `SELECT   tbl_bill_cancel.cancel_id AS key,
                    to_char("date_cancel", 'DD/MM/YYYY') AS date ,
                    tbl_bill_cancel.time_cancel AS time,
                    tbl_bill_cancel.bill_number AS billNumber,
                    tbl_bill_cancel_detail.lottery_price AS billPrice
           FROM tbl_bill_cancel, tbl_bill_cancel_detail  
           WHERE tbl_bill_cancel.cancel_id = tbl_bill_cancel_detail.cancel_id 
           AND tbl_bill_cancel.device_code = $1 
           AND tbl_bill_cancel.period_number = $2`;

    db.connect((err, client, done) => {
        if (!err) {
            client.query(sql, [device_code, drawnumber], (error, results) => {
                if (error) {
                    logger.error(error)
                    return res.status(403).send(error.STA);
                }
                if (results.rowCount == 0) {
                    logger.error(res.STA)
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


exports.cancelbilldetaillist = (req, res) => {
    totalPrice = 0;
    bill_id = req.params.bill_id;
    sql = `SELECT tbl_bill_cancel.bill_number,
                  tbl_bill_cancel_detail.lottery_price AS price,
                  tbl_bill_cancel_detail.lottery_number AS number 
           FROM   tbl_bill_cancel,tbl_bill_cancel_detail 
           WHERE  tbl_bill_cancel.bill_number = tbl_bill_cancel_detail.bill_number
           AND    tbl_bill_cancel.cancel_id = $1`;

    db.connect((err, client, done) => {
        if (!err) {
            client.query(sql, [bill_id], (error, results) => {
                if (error) {
                    logger.error(error)
                    return res.status(403).send(error);
                }
                if (results.rowCount == 0) {
                    return res.status(404).send('not found');
                }
                else {
                    for (let i = 0; i < results.rowCount; i++) {
                        totalPrice += results.rows[i].price;
                    }
                    res.json({
                        status: true,
                        statusCode: 200,
                        message: "OK",
                        data: {
                            billNumber: results.rows[0].bill_number,
                            totalPrice: totalPrice,
                            list: results.rows
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

};














