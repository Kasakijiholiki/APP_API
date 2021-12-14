
let bill = require('../models/bill.model')
const db = require('../config-db/connection')
let SQL = ""
const date = require('../getdate/datenow')
const { v4: uuidv4 } = require('uuid');
const logger = require('../config-log/logger')
const format = require('pg-format');
const { Pool } = require('pg')
const pool = new Pool()
//Create sale
exports.createsale = async (req, res) => {

    const periodNumber = req.body.periodNumber
    const deviceCode = req.params.deviceCode
    const deviceNumber = req.params.deviceNumber
    let saleViewModelList = []
    saleViewModelList = req.body
    let SaleList = []
    const bill_id = uuidv4();
let num1 = 0, num2 = 0, num3 = 0, num4 = 0, num5 = 0, num6 = 0, price1 = 0, price2 = 0, price3 = 0, price4 = 0, price5 = 0, price6 = 0
    SQL = `INSERT INTO tbl_bill VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
    const cleint = await db.connect()
    try {

        let removeBillNumberList = []
      
        //Check period online
        const curentPeriod = (await cleint.query(`SELECT period_number FROM tbl_online WHERE  online_status = 1`)).rows[0].period_number


        //______________________server online_________________________________//
        if (curentPeriod != 0 || curentPeriod != null || curentPeriod != "") {

            let lotteryNumberList = []
            let lotteryPriceList = []

            for (let i = 0; i < saleViewModelList.SaleList.length; i++) {
                SaleList.push([bill_id, bill.billNumber, saleViewModelList.SaleList[i].lotteryNumber, saleViewModelList.SaleList[i].lotteryPrice, date.getdate()])
            }

           for(let i = 0; i < saleViewModelList.SaleList.length; i++) {
                  lotteryNumberList.push(saleViewModelList.SaleList.lotteryNumber[i])
                  lotteryPriceList.push(saleViewModelList.SaleList.lotteryPrice[i])
               } 
            SQL = ` SELECT tbl_bill_detail.lottery_number AS number, sum(tbl_bill_detail.lottery_price) AS priceFROM tbl_bill_detail, tbl_bill
                    WHERE tbl_bill_detail.bill_number IN (SELECT bill_number FROM tbl_bill)
                    AND   tbl_bill.period_number = $1
                    GROUP BY lottery_number`

            const lotteryList = (await (cleint.query(SQL, [bill.periodNumber]))).rows
           
            //_______________________GET QUOATA LIST___________________________________// 
            const quotaList = (await (cleint.query(`SELECT digit_length AS num, price_per_number AS price FROM tbl_quota`))).rows
         
            //______________________GET DIGIT LENGHT AND PRICE PER NUMBER FOM QUOATA__//
            for(let k = 0; k < quotaList.length; k++) {
                if(quotaList[k].num == 1) {
                    num1 = 1
                    price1 = quotaList[k].price
                   }
                   else if(quotaList[k].num == 2) {
                    num2 = 2
                    price2 = quotaList[k].price
                   }
                   else if(quotaList[k].num == 3) {
                    num3 = 3
                    price3 = quotaList[k].price
                   }
                   else if(quotaList[k].num == 4) {
                    num4 = 4
                    price4 = quotaList[k].price
                   }
                   else if(quotaList[k].num == 5) {
                    num5 = 5
                    price5 = quotaList[k].price
                   }
                   else if(quotaList[k].num == 6) {
                    num6 = 6
                    price6 = quotaList[k].price
                   }
            }
             

            for(let j = 0; j < lotteryPriceList.length; j++) {

                if(lotteryNumberList[j] == lotteryList.rows[j].number && lotteryNumberList[j].length == 1) {
                 
                    const price = parseInt(lotteryPriceList[j] + lotteryList.rows[j].number)

                    // if(quotaList.rows.) {

                    // }
                    
                    if(price > quotaList.rows[j].digit_length) {

                        removeBillNumberList.push(lotteryNumberList[j])
                        SaleList.splice(j, 1)

                    }
                }
                
            }



            await cleint.query(`BEGIN`)
            //_________GET BRANCH_ID AND UNIT_ID FROM USER_______//
            let user = {}
            const _user = cleint.query(`SELECT branch_id, unit_id FROM tbl_user_seller WHERE device_code = $1`, [deviceCode])
            if ((await _user).rowCount > 0) {
                user = ((await _user).rows[0])
            }
            //__________GET TOTAL PRICE FROM SALE LIST-__________//
            let bill_price = 0
            for (let i = 0; i < saleViewModelList.SaleList.length; i++) {
                bill_price += parseInt(saleViewModelList.SaleList[i].lotteryPrice)
            }
            //_________GET DEVICE_REF FROM DEVICE_______________//
            let device_ref = ""
            const _device = cleint.query(`SELECT device_ref, device_number FROM tbl_device WHERE device_code = $1`, [deviceCode])
            if ((await _device).rowCount > 0) {
                device_ref = ((await _device).rows[0].device_ref)
            }
            //_________GENERAT BILL ID___________________________//
            bill.billNumber = periodNumber + "" + deviceCode

            //_________INSERT DATA TO DATABASE TO BILL___________//
            await cleint.query(SQL,
                [
                    bill_id,
                    bill.billNumber,
                    periodNumber,
                    deviceCode,
                    device_ref,
                    bill_price,
                    date.getdate(),
                    date.gettime(),
                    user.branch_id,
                    user.unit_id,
                    deviceNumber], (error, results) => {
                        if (error) {
                            logger.error(error)
                            return res.status(400).send({ error: error.stack })
                        }
                        if (results.rowCount > 0) {
                            for (let i = 0; i < saleViewModelList.SaleList.length; i++) {
                                SaleList.push([bill_id, bill.billNumber, saleViewModelList.SaleList[i].lotteryNumber, saleViewModelList.SaleList[i].lotteryPrice, date.getdate()])
                            }
                            //________________INSERT DATA TO DATABASE TO BILL DETAIL_________________//
                            SQL = `INSERT  INTO tbl_bill_detail (bill_id, bill_number, lottery_number, lottery_price, date_bill_detail) VALUES %L`
                            cleint.query(format(SQL, SaleList), [], async (er, rs) => {
                                if (er) {
                                    logger.error(er)
                                    return res.status(401).send({ error: er.stack })
                                }
                                //____________WHEN SUCESS FOR SALE WILL COMMIT AND RETURN DATA FOR TO SHOW ON BILL_______//
                                if (rs.rowCount > 0) {
                                    await cleint.query(`COMMIT`)
                                    return res.status(201).send({
                                        status: true,
                                        statusCode: 200,
                                        message: "OK",
                                        data: {
                                            newbillId: bill.billNumber,
                                            saleViewModelList: saleViewModelList.SaleList,
                                            totalPrice: bill_price,
                                            removeBillNumberList: removeBillNumberList
                                        }
                                    })

                                }
                                //__________WHEN NOT SUCESS SOME DATA ROLLBACK_________
                                else {
                                    await cleint.query(`ROLLBACK`)
                                    return res.status(500)
                                }
                            })
                        } else {
                            return res.status(500)
                        }
                    })
        } 
        //____________________server offline______________________//
        else {
            return res.status(501).send({message: "server offline"})
        }
    } catch (error) {
        await cleint.query(`ROLLBACK`)
        logger.error(error.stack)
        return res.status(500).send(error.stack)
    } finally {
        cleint.release()
    }
    // else {
    //     return res.status(501).send({message: "Server offline"})
    // }
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
    const { lotteryNumber, lotteryPrice, totalPrice, deviceCode, periodNumber } = req.params
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