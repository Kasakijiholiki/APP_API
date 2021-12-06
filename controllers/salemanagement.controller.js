
let bill = require('../models/bill.model')
const db = require('../config-db/connection')
let SQL = ""
const date = require('../getdate/datenow')
const { v4: uuidv4 } = require('uuid');
const logger = require('../config-log/logger')
const format = require('pg-format');

//Insert sale
exports.createsale = async (req, res) => {

    bill = req.body || req.params
    const deviceNumber = req.params.deviceNumber

    let saleViewModel = []
    saleViewModel = req.body
    let saleList = []

    const bill_id = uuidv4();

    SQL = `INSERT INTO tbl_bill VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
    db.connect((err, cleint, done) => {
        if (!err) {

            //Query user data because need branch and unit from tbLuser_seller
            let user = {}
            cleint.query(`SELECT * FROM tbl_user_seller WHERE device_code = $1`, [bill.device_code], (error, results) => {
                if (!error && results.rowCount > 0) {
                    user = results.rows[0]
                }
            });
            //Sum bill price from list loterry price
            let bill_price = 0
            for (let i = 0; i < saleViewModel.saleList.length; i++) {
                bill_price += saleViewModel.saleList[i].lotteryPrice
            }
            //Get deive ref and device number
            let device_ref = ""
            cleint.query(`SELECT device_ref FROM tbl_device WHERE device_code = $1`, [bill.deviceCode], (error, results) => {
                if (!error && results.rowCount > 0) {
                    device_ref = results.rows[0].device_ref
                }
            });
            //make bill number
            bill.billNumber = '2100212300'

            //Add data to bill
            cleint.query(SQL,
                [
                    bill_id,
                    bill.billNumber,
                    bill.periodNumber,
                    bill.deviceCode,
                    device_ref,
                    bill_price,
                    date.getdate(),
                    date.gettime(),
                    user.branch_id,
                    user.unit_id,
                    deviceNumber

                ], (error) => {
                    if (error) {
                        logger.error(error)
                        return res.status(403).send({ error: error.stack })
                    }
                    else {

                        //add data to saleList 
                        for (let i = 0; i < saleViewModel.saleList.length; i++) {

                            saleList.push([bill_id, bill.bill_number, saleViewModel.saleList[i].lotteryNumber, saleViewModel.saleList[i].lotteryPrice, date.getdate()])
                        }

                        //Add data sale from saleList to  bill detail
                        SQL = `INSERT  INTO tbl_bill_detail (bill_id, bill_number, lottery_number, lottery_price, date_bill_detail) VALUES %L`
                        cleint.query(format(SQL, saleList), [], (er) => {
                            if (error) {
                                logger.error(er)
                                return res.status(403).send({ error: er.stack })
                            }
                            else {
                                return res.status(201).send({ message: "Created" })
                            }
                        })

                    }
                })
            done();
        }
    })
}


//Check quota
is_price_pernumber_less_than = (price, number, digiLength) => {
    db.connect((err, cleint, done) => {
        if (!err) {

            let isPass = false
            cleint.query(`SELECT * FROM tbl_quota`, [], (error, resluts) => {

                if (!error) {
                    for (let i = 0; i < resluts.rows.length; i++) {

                        digiLength = number[i].length

                        switch (digiLength) {
                            //Number 1
                            case 1:
                                if (price[i] > resluts.rows[i].price_per_number) {
                                    isPass = false
                                } else {
                                    isPass = true
                                }
                                break;
                            //Number 2
                            case 2:
                                if (price[i] > resluts.rows[i].price_per_number) {
                                    isPass = false
                                } else {
                                    isPass = true
                                }
                                break;
                            //Number 3
                            case 3:
                                if (price[i] > resluts.rows[i].price_per_number) {
                                    isPass = false
                                } else {
                                    isPass = true
                                }
                                break;
                            //Number 4
                            case 4:
                                if (price[i] > resluts.rows[i].price_per_number) {
                                    isPass = false
                                } else {
                                    isPass = true
                                }
                                break;
                            //Number 5
                            case 5:
                                if (price[i] > resluts.rows[i].price_per_number) {
                                    isPass = false
                                } else {
                                    isPass = true
                                }
                                break;
                            //Number 6
                            case 6:
                                if (price[i] > resluts.rows[i].price_per_number) {
                                    isPass = false
                                } else {
                                    isPass = true
                                }
                                break;
                        }
                    }
                }
            })
            done();
        } else {
            logger.error(err)
        }
    })
    return isPass;
}
