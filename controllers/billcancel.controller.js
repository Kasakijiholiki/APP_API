
const db = require('../config-db/connection')
let bill = require('../models/bill.model')
const date = require('../getdate/datenow')
const logger = require('../config-log/logger')
let SQL = ''
const { v4: uuidv4 } = require('uuid');
const format = require('pg-format')

//Get bill cancel
exports.get = async (req, res) => {
    bill = req.params
    await db.connect(async (err, cleint, done) => {
        if (!err) {
            try {
                let billDetailList = {}
                let periodNumber = ""
                let billNumber = ""
               
                //Get period number
                const _periodNumber = cleint.query(`SELECT period_number FROM tbl_online WHERE online_status = 1`)
                if ((await _periodNumber).rowCount) {
                    periodNumber = (await _periodNumber).rows[0].period_number
                }

                //Get data from bill
                let billData = ""
                const _billData = cleint.query(`SELECT * FROM tbl_bill WHERE period_number = $1 AND device_code = $2 ORDER BY bill_number DESC`, [periodNumber, bill.deviceCode])
                if ((await _billData).rowCount > 0) {
                    billData = (await _billData).rows
                    billNumber = (await _billData).rows[0].bill_number
                    bill.billId = (await _billData).rows[0].bill_id
                }

                //Get data from bill cancel
                let cancelData = null
                const _cancelData = cleint.query(`SELECT * FROM tbl_bill_cancel WHERE bill_number = $1 AND period_number = $2 AND device_code = $3`, [billNumber, periodNumber, bill.deviceCode])
                if ((await _cancelData).rowCount > 0) {
                    cancelData = (await _cancelData).rows
                }

                if (billData != "" && cancelData == null) {
                    billDetailList = ((await (cleint.query(`SELECT * FROM tbl_bill_detail WHERE bill_id = $1`, [ bill.billId]))).rows)
                 } 
                 else if (billData != "" && cancelData != null) {

                    const cancelDetailList =  cleint.query(`SELECT * FROM tbl_bill_cancel_detail WHERE cancel_id = $1`, [cancelData[0].cancel_id])
                   
                    if ((await cancelDetailList).rowCount > 0) {
                        let billDetail = []
                        for (let i = 0; i < (await cancelDetailList).rows.length; i++) {

                            billDetail.push({lottery_number: (await cancelDetailList).rows[i].lottery_number, lottery_price: (await cancelDetailList).rows[i].lottery_price})
                        }
                        billDetailList = billDetail
                    }
                }

                return res.send({
                    status: true,
                    stausCode: 200,
                    message: "OK",
                    data: {
                        deviceCode: bill.deviceCode,
                        hasCancel: cancelData != null,
                        billId: billData != "" ? billData[0].bill_id : uuidv4(),
                        billNumber: billNumber,
                        billTotal: billData != "" ? billData[0].bill_price : 0,
                        billDetailList: billDetailList
                    }
                })
            } catch (error) {
                logger.error(error)
            }
            done()
        } else {
            logger.error(err)
            return res.status(500).send("Connect DB failed")
        }
    })
}
//Create billcancel
exports.billCancel = async (req, res) => {
    bill = req.params
    const cancel_id = uuidv4();
    SQL = `SELECT bill_id, bill_number, period_number, device_code, bill_price, ref_code FROM tbl_bill 
           WHERE device_code = $1  AND bill_id = $2`

    //First case conncect DB
    await db.connect(async (err, cleint, done) => {
        if (!err) {
            try {
                //First case query (query data from bill for insert into bill cancel)
                await cleint.query(SQL, [bill.deviceCode, bill.billId], async (error, results) => {

                    if (error) {
                        logger.error(error.stack)
                        return res.status(403).send({ message: 'Error for query bill data', error: error.stack })
                    }
                    if (results.rowCount <= 0) {
                        return res.status(404).send({ message: "Bill not found" })
                    }
                    else {

                        SQL = `INSERT INTO tbl_bill_cancel VALUES ($1, $2, $3, $4, $5, $6, 0, $7, $8, $9)`
                        // (Insert into bill cancel)
                        await cleint.query(SQL, 
                            [cancel_id,
                             results.rows[0].bill_number,
                             results.rows[0].period_number,
                             results.rows[0].device_code,
                             results.rows[0].bill_price,
                             bill.reasonCancel,
                             date.getdate(), 
                             date.gettime(),
                             results.rows[0].ref_code],
                             async (erro, resu) => {

                                if (erro) {
                                    logger.error(erro.stack)
                                    return res.status(403).send({ message: 'Error for create bill cancel', error: erro.stack })
                                }
                                if (resu.rowCount > 0) {
                                    
                                    SQL = `SELECT * FROM tbl_bill_detail WHERE bill_id = $1`
                                    //Query data from bill detail
                                    cleint.query(SQL, [bill.billId], (er, rs) => {
                                        if (er) {
                                            logger.error(er.stack)
                                            return res.status(403).send({ err: er.stack })
                                        }
                                        if (rs.rowCount <= 0) {
                                            return res.status(404).send({ message: 'Not found data from bill_detail' })
                                        } else {

                                            //push bill detail into array for add to cancel detail
                                            let billcanceldetail = []
                                            for (let i = 0; i < rs.rows.length; i++) {
                                                billcanceldetail.push([cancel_id, rs.rows[i].bill_number, rs.rows[i].lottery_number, rs.rows[i].lottery_price, date.getdate()])
                                            }

                                            SQL = `INSERT INTO tbl_bill_cancel_detail(cancel_id, bill_number, lottery_number,
                                              lottery_price, date_bill_cancel_detail) VALUES %L`

                                            //Create data to bill cancel detail
                                            cleint.query(format(SQL, billcanceldetail), [], (error1, resu1) => {
                                                if (error1) {
                                                    return res.status(403).send({ message: 'Error for create bill cancel detail', error: error1.stack })
                                                }
                                                if (resu1.rowCount > 0) {
                                                    SQL = `DELETE FROM tbl_bill_detail WHERE bill_id = $1`
                                                    // Delete data from bill detail
                                                    cleint.query(SQL, [bill.billId], (r1) => {
                                                        if (r1) {
                                                            return res.status(403).send({ message: "Error for delete bill detail", error: r1.stack })
                                                        } else {
                                                            return res.status(200).send({
                                                                 status: true,
                                                                 statusCode: 200,
                                                                 message: "OK"
                                                                 })
                                                        }

                                                    })

                                                }

                                            })
                                        }
                                    })
                                }
                            })
                    }
                })
            } catch (error) {
                logger.error(error)
            }
            done();
        } else {
            logger.error(err)
            return res.status(500).send({ message: "Server error" })
        }
    })
}
