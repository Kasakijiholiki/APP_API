
const db     = require("../config-db/connection");
let  bill_id, totalPrice, totalSale, sql, totalReords, totalCance, device_code, drawNumber
let par  = {device_code: 'Tong',
           drawNumber: 'Yang'}
const logger = require('../config-log/logger')
const task   = require('../tasks')


exports.billlist = (req, res) => {
    totalPrice = 0;
    totalSale = 0;
   const  deviceCode = req.params.deviceCode;
   const  drawNumber = req.params.drawNumber;
    sql = `SELECT tbl_bill.bill_id AS key,
                  to_char("date_bill", 'DD/MM/YYYY') AS date,
                  tbl_bill.time_bill AS time,       
                  tbl_bill_detail.bill_number AS billnumber,
                  tbl_bill.bill_price AS billprice
           FROM   tbl_bill, tbl_bill_detail
           WHERE  tbl_bill.bill_id = tbl_bill_detail.bill_id
           AND    tbl_bill.device_code = $1
           AND    tbl_bill.period_number = $2`;
    db.connect((err, client, done) => {
        if (!err) {
            client.query(sql, [deviceCode, drawNumber], (error, results) => {
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
    device_code = req.params.device_code
    drawnumber = req.params.drawnumber

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

exports.get = async (req, res) => {
totalCancel = '0'
totalPrice  = '0'
totalSale   = '0'
//let {device_code, drawNumber} = req.params
const device_code = req.params.device_code
const drawNumber  = req.params.drawNumber

await db.connect(async(err, client, done) => {
    if (!err) {

    //#region  Get totalsale
            const _totalSale = client.query(` SELECT bill_id
                                              FROM   tbl_bill
                                              WHERE  bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
                                              AND    device_code = $1 
                                              AND    period_number = $2`, [device_code, drawNumber])
        totalSale = (await _totalSale).rowCount
       console.log(totalSale)
    //#endregion

    //#region Get total cancel
             const _cancelList = client.query(`SELECT bill_number
                                               FROM   tbl_bill_cancel
                                               WHERE  device_code = $1
                                               AND    period_number = $2`, [device_code, drawNumber])
            totalCancel = (await _cancelList).rowCount
           
    //#endregion

    //#region Get bill detail list
        let billDetailList = null
        const _billDetailList = client.query(`	  
        SELECT           tbl_bill.bill_id AS key,
                         LENGTH   (tbl_bill_detail.lottery_number) AS digit,	 
                         SUM      (tbl_bill_detail.lottery_price) AS price       
        FROM             tbl_bill, tbl_bill_detail
        WHERE            tbl_bill.bill_number = tbl_bill_detail.bill_number
        AND              tbl_bill.bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
        AND              tbl_bill.device_code = $1 
        AND              tbl_bill.period_number = $2
        GROUP BY         tbl_bill.bill_id , tbl_bill_detail.lottery_number, tbl_bill_detail.lottery_price `, [device_code, drawNumber])
        billDetailList = (await _billDetailList).rows
   //#endregion
    

    //#region Get bill detail list
    let billNumberList = null
    const _billNumberList = client.query(`	  
    SELECT           tbl_bill.bill_number AS billNumber
    FROM             tbl_bill, tbl_bill_detail
    WHERE            tbl_bill.bill_number = tbl_bill_detail.bill_number
    AND              tbl_bill.device_code = $1 
    AND              tbl_bill.period_number = $2
    GROUP BY         tbl_bill.bill_number, tbl_bill_detail.lottery_number
    ORDER BY LENGTH(tbl_bill_detail.lottery_number) `, [device_code, drawNumber])
    billNumberList = (await _billNumberList).rows
//#endregion


    return res.send({
            drawNumber: drawNumber,
            totalSale: totalSale,
            totalCancel: totalSale,
            billDetailList: billDetailList            
        })  
    }
    else {
        logger.error(err);
        return res.status(500).send('Server error');
    }
})
}



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
        
//         billNumberList = (await _billNumberList).rows.bill_number

//         const a = {
//             key: billDetailList.key,
//             lottery_number: billDetailList.lottery_number,
//             digit: billDetailList.digit,
//             price: billDetailList.price,
//             billNumberList
//         }
// }
// }


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

// // }
//         billNumberList = (await _billNumberList).rows.bill_number

//         const a = {
//             key: billDetailList.key,
//             lottery_number: billDetailList.lottery_number,
//             digit: billDetailList.digit,
//             price: billDetailList.price,
//             billNumberList
//         }

//         else {
//             logger.error(err);
//             return res.status(500).send('Server error');

//         }
//     })
// };










//         return res.send({
//             drawNumber: drawnumber,
//             totalSale: parseInt(totalSale),
//             totalCancel: parseInt(totalCancel),
//             billDetailList: [
//                 a
//             ]
//         })


//         throw error

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

