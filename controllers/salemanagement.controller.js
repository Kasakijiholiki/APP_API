
let bill = require('../models/bill.model')
const db = require('../config-db/connection')
let SQL = ""
const date = require('../getdate/datenow')
const { v4: uuidv4 } = require('uuid');
const logger = require('../config-log/logger')
const format = require('pg-format');
const { query } = require('../config-log/logger');

//Create sale
exports.createsale = async (req, res) => {

    bill = req.body || req.params
    const deviceNumber = req.params.deviceNumber
    let saleViewModel = []
    saleViewModel = req.body
    let saleList = []
    const bill_id = uuidv4();

    SQL = `INSERT INTO tbl_bill VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
    await db.connect(async (err, cleint, done) => {
        if (!err) {

            try {
                //Seller Group. Get user seller info
                let user = {}
                const _user = cleint.query(`SELECT branch_id, unit_id FROM tbl_user_seller WHERE device_code = $1`, [bill.deviceCode])
                if ((await _user).rowCount > 0) {
                    user = ((await _user).rows[0])
                }
                //Sum bill price from list loterry price
                let bill_price = 0
                for (let i = 0; i < saleViewModel.saleList.length; i++) {
                    bill_price += saleViewModel.saleList[i].lotteryPrice
                }
                //Device Group. Get device info
                let device_ref = ""
                const _device = cleint.query(`SELECT device_ref, device_number FROM tbl_device WHERE device_code = $1`, [bill.deviceCode])
                if ((await _device).rowCount > 0) {
                    device_ref = ((await _device).rows[0].device_ref)
                }
                //make bill number
                bill.billNumber = bill.periodNumber + bill.deviceCode

                //Add data to bill
                await cleint.query(SQL,
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
                                saleList.push([bill_id, bill.billNumber, saleViewModel.saleList[i].lotteryNumber, saleViewModel.saleList[i].lotteryPrice, date.getdate()])
                            }

                            //Add data sale from saleList to  bill detail
                            SQL = `INSERT  INTO tbl_bill_detail (bill_id, bill_number, lottery_number, lottery_price, date_bill_detail) VALUES %L`
                            cleint.query(format(SQL, saleList), [], (er) => {
                                if (error) {
                                    logger.error(er)
                                    return res.status(403).send({ error: er.stack })
                                }
                                else {
                                    return res.status(201).send({
                                        data: req.body
                                    })
                                }
                            })
                        }
                    })
            } catch (error) {
                logger.error(error.stack)
                return res.status(500).send(error.stack)
            }

            done();
        }
        else {
            logger.error(err.stack)
            return res.status(500).send({ message: "Server error", error: err.stack })
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

//Get config data.
exports.getconfigdata = async (req, res) => {
    await db.connect(async (err, cleint, done) => {
        if (!err) {
            try {
                let period_number = ""
                let maxDigitLength = 0
                //Get current period number online
                const _period_number = cleint.query(`SELECT period_number FROM tbl_online WHERE online_status = 1 ORDER BY online_id DESC`)
                if ((await _period_number).rowCount > 0) {
                    period_number = ((await _period_number).rows[0].period_number)
                }

                //Get max digit length
                const _maxdg = cleint.query(`SELECT max_lenght FROM tbl_digit_lenght`)
                if ((await _maxdg).rowCount > 0) {
                    maxDigitLength = ((await _maxdg).rows[0].max_lenght)
                }

                cleint.query(`SELECT * FROM tbl_random`, [], (error, results) => {
                    if (!error) {
                        return res.send({
                            status: true,
                            statusCode: 200,
                            message: "OK",
                            totalRecords: 0,
                            data: {
                                periodNumber: period_number,
                                maxDigitLength: maxDigitLength,
                                randomDigitList: [
                                    results.rows
                                ]
                            }
                        })
                    }
                })
            } catch (error) {
                logger.error(error.stack)
                return res.status(500).send(error.stack)
            }
            done();
        } else {
            logger.error(err.stack)
            return res.status(500).send({ message: "Server error", error: err.stack })
        }
    })
}
//Get currrent number 
exports.getCurrentperiodnumber = (req, res) => {
    db.connect((err, cleint, done) => {
        if (!err) {
            try {
                cleint.query(`SELECT period_number FROM tbl_online WHERE online_status = 1 ORDER BY online_id DESC`, [], (error, resluts) => {
                    if (!error && resluts.rowCount > 0) {
                        return res.send({
                            status: true,
                            statusCode: 200,
                            message: "OK",
                            totalRecords: 0,
                            data: resluts.rows[0].period_number
                        })
                    } else {
                        return res.status(404).send({ message: "Sever offline" })
                    }
                })
            } catch (error) {
                logger.error(error.stack)
                return res.status(500).send({ message: error.stack })
            }
            done();
        }
        else {
            logger.error(err.stack)
            return res.status(500).send({ message: "Server error", error: err.stack })
        }
    })
}
//Check number price 
exports.checknumberprice = async (req, res) => {
    const { lotteryNumber, lotteryPrice, totalPrice, deviceCode, periodNumber} = req.params
    await db.connect(async (err, cleint, done) => {
        if (!err) {
            try {
                //Get max digit length
                let max_lenght = 0
                const _maxdg = cleint.query(`SELECT max_lenght FROM tbl_digit_lenght`)
                if ((await _maxdg).rowCount > 0) {
                    max_lenght = ((await _maxdg).rows[0].max_lenght)
                }
                //Beging check
                if (lotteryNumber.length > max_lenght) {
                    return res.status(403).send(`ເລກສ່ຽງສາມາດຂາຍໄດ້ ${max_lenght} ເທົ່ານັ້ນ`)
                }

                if (lotteryPrice < 1000) {
                    return res.status(403).send(`ລາຄາຕ້ອງແມ່ນຫນຶ່ງພັນຂຶ້ນໄປ`)
                }

                if (lotteryPrice % 1000 != 0) {
                    return res.status(403).send(`ລາຄາຄວນເປັນສອງເທົ້່າຂອງ 1000 ກີບ`)
                }

                let max_sell = 0
                const _ln_Data = cleint.query(`SELECT * FROM tbl_lottery_number WHERE lottery_number = $1`, [lotteryNumber])
                if ((await _ln_Data).rowCount > 0) {
                    max_sell = (await _ln_Data).rows.max_sell
                    if ((await _ln_Data).rows[0].ln_status != 1) {
                        return res.status(403).send(`ເລກສ່ຽງ ${lotteryNumber}ເຕັມແລ້ວ`)
                    }
                    let lottery_price = 0
                    const _lottery_price = cleint.query(`SELECT SUM(lottery_price) AS price FROM tbl_bill_detail WHERE lottery_number = $1`, [lotteryNumber])

                    if ((await _lottery_price).rowCount > 0) {
                        lottery_price = (await _lottery_price).rows[0].price
                    }

                    const realTimeMaxPrice = max_sell - lottery_price

                    if (lottery_price == 0) {
                        if (lotteryPrice > max_sell) {
                            return res.status(403).send(`ເລກສ່ຽງ ${lotteryNumber}ເຕັມແລ້ວ`)
                        }
                    }
                }

            } catch (error) {
                logger.error(error.stack)
                return res.status(500).send({ message: error.stack })
            }
            done();
        }
        else {
            logger.error(err.stack)
            return res.status(500).send({ message: "Server error", error: err.stack })
        }
    })
}