
const bill = require('../models/bill.model')
const bill_detail = require('../models/bill_detail.model')
const db = require('../config-db/connection')
let SQL = ""

const logger = require('../config-log/logger')
//Insert sale
exports.createsale = async (req, res) => {

    bill = req.body
    bill_detail = req.body
    SQL = `INSERT INTO tbl_bill VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

    //Check that server is online or not
    if (isonline) {
        //Check that the number is over max sale or not

        if (!isovermaxsell) {
            db.connect((err, cleint, done) => {
                if (!err) {

                    //Add data to bill
                    cleint.query(SQL, [bill.bill_id, bill.bill_number, bill.period_number, bill.device_code, bill.device_ref, bill.bill_price,
                    bill.date_bill, bill.time_bill, bill.branch_id, bill.unit_id, bill.ref_code], (error, results) => {
                        if (error) {
                            logger.error(error)
                            return res.status(403).send({ error: error })
                        }
                        else {

                            //Add data sale to  bill detail
                            SQL = `INSERT INTO tbl_bill(bill_id, bill_number, lottery_number, lottery_price, date_bill_detail)
                                           VALUES ($1, $2, $3, $4, $5)`
                          
                            cleint.query(SQL, [bill.bill_id, bill.bill_number, bill.lottery_number, bill.lottery_price, bill.date_bill], (error, results) => {
                                if (error) {
                                    logger.error(error)
                                    return res.status(403).send({ error: error })
                                }
                                else {
                                    return res.status(201).send({ message: "Success" })
                                }
                            })

                        }
                    })
                    done();
                }
            })

        }
        //If over max sell 
        else {
            return res.status(403).send({ message: "cannot sale is over max sale" })
        }
    }
    //If Server offline
    else {
        return res.status(403).send({ message: "Server offline" })
    }
}