
const db = require("../config-db/connection");
let bill_id, device_code, drawnumber, totalPrice, totalSale, sql, totalReords, totalCancel;
const logger = require('../config-log/logger')
const task = require('../tasks')


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
                        totalRecords: 0,
                        data: {
                            totalSale: results.rowCount,
                            totalPrice: totalPrice,
                            billList: results.rows
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
                        totalRecords: 0,
                        data: {
                            totalSale: results.rowCount,
                            totalPrice: totalPrice,
                            billList: results.rows
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

exports.billdetaillist = (req, res) => {
    totalReords = 0;
    totalPrice = 0;
    bill_id = req.params.bill_id;
    sql = `SELECT   tbl_bill.bill_number, 
                    tbl_bill_detail.lottery_number AS number, 
                    tbl_bill_detail.lottery_price  AS price 
           FROM     tbl_bill, tbl_bill_detail 
           WHERE    tbl_bill.bill_id = tbl_bill_detail.bill_id
           AND      tbl_bill.bill_id =$1`;

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
                        totalRecords: 0,
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

// exports.get = async (req, res) => {

//     totalPrice = 0
//     totalCancel = 0
//     totalSale = 0
//     device_code = req.params.device_code;
//     drawnumber = req.params.drawnumber;

//     const client = await db.connect();

//     try {
//         //         sql = `SELECT tbl_bill.bill_price AS price,
//         //                         tbl_bill.bill_id AS key,
//         //               tbl_bill.period_number AS drawnumber,
//         //               tbl_bill.bill_number
//         // FROM   tbl_bill, tbl_bill_detail
//         // WHERE  tbl_bill.bill_number = tbl_bill_detail.bill_number
//         // AND    device_code = $1 AND period_number = $2`;


//         const _totalSale = client.query(`SELECT COUNT(*)
//                            FROM tbl_bill
//                            WHERE bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
//                            AND device_code = $1 
//                            AND period_number = $2`, [device_code, drawnumber])
//         totalSale = (await _totalSale).rows[0].count



//         const _cancelList = client.query(`SELECT COUNT(*) 
//                                           FROM   tbl_bill_cancel
//                                           WHERE  device_code = $1
//                                           AND    period_number = $2`, [device_code, drawnumber])
//         totalCancel = (await _cancelList).rows[0].count




//         let billDetailList = null
//         const _billDetailList = client.query(`	  
//         SELECT           tbl_bill.bill_id AS key,
//                          tbl_bill_detail.lottery_number,
//                          LENGTH(   tbl_bill_detail.lottery_number) AS digit,	 
//                          SUM      (tbl_bill_detail.lottery_price) AS price
//         FROM             tbl_bill, tbl_bill_detail
//         WHERE            tbl_bill.bill_number = tbl_bill_detail.bill_number
//         AND              tbl_bill.device_code = $1 
//         AND              tbl_bill.period_number = $2
//         GROUP BY         tbl_bill_detail.lottery_number,  tbl_bill.bill_id
//         ORDER BY LENGTH(tbl_bill_detail.lottery_number) `, [device_code, drawnumber])
       
//         billDetailList = (await _billDetailList).rows

         


//         let billNumberList
//         const _billNumberList = client.query(`	  
//         SELECT           tbl_bill_detail.bill_number
//         FROM             tbl_bill, tbl_bill_detail
//         WHERE            tbl_bill.bill_number = tbl_bill_detail.bill_number
//         AND              tbl_bill.device_code = $1`, [device_code])
        
<<<<<<< HEAD
//         billNumberList = (await _billNumberList).rows.bill_number

//         const a = {
//             key: billDetailList.key,
//             lottery_number: billDetailList.lottery_number,
//             digit: billDetailList.digit,
//             price: billDetailList.price,
//             billNumberList
//         }

//         return res.send({
//             drawNumber: drawnumber,
//             totalSale: parseInt(totalSale),
//             totalCancel: parseInt(totalCancel),
//             billDetailList: [
//                 a
//             ]
//         })


//     } catch (error) {
//         throw error
//     } finally {
//         client.release();
//     }

// }
=======
        billNumberList = (await _billNumberList).rows.bill_number

        const a = {
            key: billDetailList.key,
            lottery_number: billDetailList.lottery_number,
            digit: billDetailList.digit,
            price: billDetailList.price,
            billNumberList
        }

<<<<<<< HEAD
        else {
            logger.error(err);
            return res.status(500).send('Server error');

        }
    })
};
















=======
        return res.send({
            drawNumber: drawnumber,
            totalSale: parseInt(totalSale),
            totalCancel: parseInt(totalCancel),
            billDetailList: [
                a
            ]
        })
>>>>>>> 5d359cfd056ef5d246152f0fa29207b77e9548ce


    } catch (error) {
        throw error
    } finally {
        client.release();
    }

}
>>>>>>> 3c40d9333027d7bb056acba037f7c8605a5c6db8

