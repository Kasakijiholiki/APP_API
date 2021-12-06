
const db = require("../config-db/connection");
let bill_id, device_code, drawnumber, totalPrice;
const logger = require('../config-log/logger')


exports.cancelbilldetaillist = (req, res) => {
    totalPrice = 0;
    bill_id = req.params.bill_id;
    const sql = `SELECT tbl_bill_cancel.bill_number,tbl_bill_cancel_detail.lottery_price AS price,
    tbl_bill_cancel_detail.lottery_number AS number FROM tbl_bill_cancel,tbl_bill_cancel_detail 
    WHERE tbl_bill_cancel.bill_number = tbl_bill_cancel_detail.bill_number AND tbl_bill_cancel.cancel_id = $1`;

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














