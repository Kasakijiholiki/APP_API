
let bill = require('../models/bill.model')
const db = require('../config-db/connection')
let SQL = ""
const date = require('../getdate/datenow')
const { v4: uuidv4 } = require('uuid');
const logger = require('../config-log/logger')
const format = require('pg-format');
const { Pool } = require('pg');
const { string } = require('pg-format');
const { push } = require('../config-log/logger');
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

    try {

        db.connect(async (err, cleint, done) => {
            if (!err) {

                let removeBillNumberList = []
                let period_number = ""
                //Check period online
                const curentPeriod = (await cleint.query(`SELECT period_number FROM tbl_online WHERE  online_status = 1`))
                if (curentPeriod.rowCount > 0) period_number = curentPeriod.rows[0].period_number
                //______________________server online_________________________________//
                if (period_number != 0 || period_number != null || period_number != "") {

                    let lotteryNumberList = []
                    let lotteryPriceList = []
                    let numList = []
                    //_________GENERAT BILL ID___________________________//
                    let today = new Date();
                    bill.billNumber = periodNumber + "" + deviceCode + "" + today.getDate() + "" + today.getHours() + "" + today.getMinutes() + "" + today.getSeconds()

                    for (let i = 0; i < saleViewModelList.SaleList.length; i++) {
                        lotteryNumberList.push(saleViewModelList.SaleList[i].lotteryNumber)
                        lotteryPriceList.push(saleViewModelList.SaleList[i].lotteryPrice)
                        numList.push("'" + saleViewModelList.SaleList[i].lotteryNumber + "'")
                    }

                    const numberList = numList.toString()

                    //return console.log(numberList)
                    SQL = ` SELECT tbl_bill_detail.lottery_number AS number, sum(tbl_bill_detail.lottery_price) AS price FROM tbl_bill_detail, tbl_bill
                            WHERE tbl_bill_detail.bill_number = tbl_bill.bill_number
                            AND   tbl_bill.period_number = $1 AND tbl_bill_detail.lottery_number IN (${numberList})
                            GROUP BY lottery_number`

                    let lotteryList = ""
                    const _lotteryList = cleint.query(SQL, [periodNumber])

                    if ((await _lotteryList).rowCount > 0) {
                        lotteryList = (await _lotteryList).rows
                    }
                    //_______________________GET QUOATA LIST___________________________________// 
                    const quotaList = (await (cleint.query(`SELECT digit_lenght as num, price_per_number AS price FROM tbl_quota`))).rows
                    //______________________GET DIGIT LENGHT AND PRICE PER NUMBER FOM QUOATA__//
                    for (let k = 0; k < quotaList.length; k++) {
                        if (quotaList[k].num == 1) {
                            num1 = 1
                            price1 = parseInt(quotaList[k].price)
                        }
                        else if (quotaList[k].num == 2) {
                            num2 = 2
                            price2 = parseInt(quotaList[k].price)
                        }
                        else if (quotaList[k].num == 3) {
                            num3 = 3
                            price3 = parseInt(quotaList[k].price)
                        }
                        else if (quotaList[k].num == 4) {
                            num4 = 4
                            price4 = parseInt(quotaList[k].price)
                        }
                        else if (quotaList[k].num == 5) {
                            num5 = 5
                            price5 = parseInt(quotaList[k].price)
                        }
                        else if (quotaList[k].num == 6) {
                            num6 = 6
                            price6 = parseInt(quotaList[k].price)
                        }
                    }
                    //_________________CHECK PRICE PER NUMBER____________________________//
                    let price = 0
                    let num_P = 0
                    let number_L = ""
                    let index = []
                    // return console.log(lotteryList.length)
                    // LOTTERY NUMBER ALREADY HAVE IN BILL
                    if (lotteryList.length != "") {

                        for (let j = 0; j < lotteryNumberList.length; j++) {

                            number_L = lotteryNumberList[j].toString()

                            for (let x = 0; x < lotteryList.length; x++) {

                                if (lotteryList[x].number == number_L && number_L.length === 1) {
                                    num_P = parseInt(lotteryList[x].price)
                                    price = parseInt(lotteryPriceList[j] + num_P)
                                    if (price > price1) {
                                        removeBillNumberList.push(lotteryNumberList[j])
                                        //saleViewModelList.SaleList.splice(j, 1)
                                        index.push(j)
                                    }

                                }
                                else if (lotteryList[x].number == number_L && number_L.length === 2) {
                                    num_P = parseInt(lotteryList[x].price)
                                    price = parseInt(lotteryPriceList[j] + num_P)
                                    if (price > price2) {
                                        removeBillNumberList.push(lotteryNumberList[j])
                                        //saleViewModelList.SaleList.splice(j, 1)
                                        index.push(j)
                                    }

                                }
                                else if (lotteryList[x].number == number_L && number_L.length === 3) {
                                    num_P = parseInt(lotteryList[x].price)
                                    price = parseInt(lotteryPriceList[j] + num_P)
                                    if (price > price3) {
                                        removeBillNumberList.push(lotteryNumberList[j])
                                        //saleViewModelList.SaleList.splice(j, 1)
                                        index.push(j)
                                    }

                                }
                                else if (lotteryList[x].number == number_L && number_L.length === 4) {
                                    num_P = parseInt(lotteryList[x].price)
                                    price = parseInt(lotteryPriceList[j] + num_P)
                                    if (price > price4) {
                                        removeBillNumberList.push(lotteryNumberList[j])
                                        //saleViewModelList.SaleList.splice(j, 1)
                                        index.push(j)
                                    }

                                }
                                else if (lotteryList[x].number == number_L && number_L.length === 5) {
                                    num_P = parseInt(lotteryList[x].price)
                                    price = parseInt(lotteryPriceList[j] + num_P)
                                    if (price > price5) {
                                        removeBillNumberList.push(lotteryNumberList[j])
                                        // saleViewModelList.SaleList.splice(j, 1)
                                        index.push(j)
                                    }

                                }
                                else if (lotteryList[x].number == number_L && number_L.length === 6) {
                                    num_P = parseInt(lotteryList[x].price)
                                    price = parseInt(lotteryPriceList[j] + num_P)
                                    if (price > price6) {
                                        removeBillNumberList.push(lotteryNumberList[j])
                                        //saleViewModelList.SaleList.splice(j, 1)
                                        index.push(j)
                                    }

                                }
                                else {
                                    new_P = parseInt(lotteryPriceList[j])
                                    if (number_L.length === 1) {

                                        if (new_P > price1) {
                                            removeBillNumberList.push(lotteryNumberList[j])
                                            //saleViewModelList.SaleList.splice(j, 1)
                                            index.push(j)
                                        }
                                    }
                                    else if (number_L.length === 2) {

                                        if (new_P > price2) {
                                            removeBillNumberList.push(lotteryNumberList[j])
                                            //saleViewModelList.SaleList.splice(j, 1)
                                            index.push(j)
                                        }
                                    }
                                    else if (number_L.length === 3) {
                                        if (new_P > price3) {
                                            removeBillNumberList.push(lotteryNumberList[j])
                                            // saleViewModelList.SaleList.splice(j, 1)
                                            index.push(j)
                                        }
                                    }
                                    else if (number_L.length === 4) {
                                        if (new_P > price4) {
                                            removeBillNumberList.push(lotteryNumberList[j])
                                            //saleViewModelList.SaleList.splice(j, 1)
                                            index.push(j)
                                        }
                                    }
                                    else if (number_L.length === 5) {
                                        if (new_P > price5) {
                                            removeBillNumberList.push(lotteryNumberList[j])
                                            // saleViewModelList.SaleList.splice(j, 1)
                                            index.push(j)
                                        }

                                    }
                                    else if (number_L.length === 6) {
                                        if (new_P > price6) {
                                            removeBillNumberList.push(lotteryNumberList[j])
                                            //saleViewModelList.SaleList.splice(j, 1)
                                            index.push(j)
                                        }
                                    }
                                }

                            }

                            price = 0
                            new_P = 0
                            number_L = ""
                        }
                    }
                    //These lottery number do not exit in DB    
                    else {

                        for (let j = 0; j < lotteryNumberList.length; j++) {

                            new_P = parseInt(lotteryPriceList[j])

                            number_L = lotteryNumberList[j].toString()

                            if (number_L.length == 1) {

                                if (new_P > price1) {
                                    removeBillNumberList.push(lotteryNumberList[j])
                                    // saleViewModelList.SaleList.splice(j, 1)
                                    index.push(j)
                                }
                            }
                            else if (number_L.length == 2) {
                                if (new_P > price2) {
                                    removeBillNumberList.push(lotteryNumberList[j])
                                    saleViewModelList.SaleList.splice(j, 1)
                                }
                            }
                            else if (number_L.length == 3) {
                                if (new_P > price3) {
                                    removeBillNumberList.push(lotteryNumberList[j])
                                    // saleViewModelList.SaleList.splice(j, 1)
                                    index.push(j)
                                }
                            }
                            else if (number_L.length == 4) {
                                if (new_P > price4) {
                                    removeBillNumberList.push(lotteryNumberList[j])
                                    //saleViewModelList.SaleList.splice(j, 1)
                                    index.push(j)
                                }
                            }
                            else if (number_L.length == 5) {
                                if (new_P > price5) {
                                    removeBillNumberList.push(lotteryNumberList[j])
                                    //saleViewModelList.SaleList.splice(j, 1)
                                    index.push(j)
                                }

                            }
                            else if (number_L.length == 6) {

                                if (new_P > price6) {

                                    removeBillNumberList.push(lotteryNumberList[j])

                                    // saleViewModelList.SaleList.splice(j, 1)
                                    index.push(j)


                                }
                            }
                        }

                        price = 0
                        new_P = 0
                        number_L = ""
                    }

                    //_____________________CHECK PRICE AND LOTTERY NUMBER LENGHT FOR SELL ____________________//
                    for (let l = 0; l < saleViewModelList.SaleList.length; l++) {
                        let length = '' + saleViewModelList.SaleList[l].lotteryNumber
                        if (length.length > 6) {
                            return res.status(300).send({ message: "can not sell lottery length more than 6" })
                        }
                        else if (saleViewModelList.SaleList[l].lotteryPrice < 1000) {

                            return res.status(301).send({ message: "can not sell price less than 1000 kip" })
                        }
                        else if (saleViewModelList.SaleList[l].lotteryPrice % 1000 != 0) {
                            return res.status(302).send({ message: "price should be multi 1000 kip" })
                        }
                    }

                    //________________________CHECK PRICE BALANCH PER DEVICE________________//
                    let maxsell = 0
                    const _maxsell = cleint.query(`SELECT max_sell FROM tbl_device_max_sell WHERE device_code = $1`, [deviceCode])
                    if ((await _maxsell).rowCount > 0) {
                        maxsell = (await _maxsell).rows[0].max_sell
                    }
                    let Sale = 0
                    const saled = cleint.query(`SELECT sum(tbl_bill_detail.lottery_price) AS total FROM tbl_bill, tbl_bill_detail 
                                                WHERE tbl_bill.bill_number = tbl_bill_detail.bill_number
                                                AND tbl_bill.period_number = $1
                                                AND tbl_bill.device_code   = $2`, [periodNumber, deviceCode])

                    if ((await saled).rows[0].total != null || (await saled).rows[0].total != 0 || (await saled).rows[0].total != "") {
                        Sale = (await saled).rows[0].total
                    }


                    let flag = true
                    if (maxsell != null || maxsell > 0 || maxsell != "") {
                        let totalPrice = 0
                        let cansell = 0
                        for (price = 0; price < saleViewModelList.SaleList.length; price++) {
                            totalPrice += parseInt(saleViewModelList.SaleList[price].lotteryPrice)
                        }
                        totalPrice += parseInt(Sale)

                        if (totalPrice > maxsell) {

                            cansell = parseInt(totalPrice - maxsell)

                            flag = false
                            return res.status(405).send({ message: `You can can sell price ${maxsell} only. But now is:  ${cansell}` })
                        }
                    }
                    saleViewModelList.SaleList = saleViewModelList.SaleList.filter(function (value, i) {
                        return index.indexOf(i) == -1;

                    })

                    //___________________BEGING TO PROCESS SALE_____________________//
                    if (flag && saleViewModelList.SaleList.length > 0) {

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


                        //_________INSERT DATA TO DATABASE TO BILL___________//

                        SQL = `INSERT INTO tbl_bill VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`
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
                                deviceNumber], async (error, results) => {
                                    if (error) {
                                        logger.error(error)
                                        return res.status(403).send({ error: error.stack })
                                    }
                                    if (results.rowCount > 0) {

                                        for (let i = 0; i < saleViewModelList.SaleList.length; i++) {
                                            SaleList.push([bill_id, bill.billNumber, saleViewModelList.SaleList[i].lotteryNumber, saleViewModelList.SaleList[i].lotteryPrice, date.getdate()])
                                        }

                                        //________________INSERT DATA TO DATABASE TO BILL DETAIL_________________//
                                        SQL = `INSERT  INTO tbl_bill_detail (bill_id, bill_number, lottery_number, lottery_price, date_bill_detail) VALUES %L`
                                        await cleint.query(format(SQL, SaleList), [], async (er, rs) => {
                                            if (er) {
                                                logger.error(er)
                                                return res.status(403).send({ error: er.stack })
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
                                                        maxsell: maxsell,
                                                        removeBillNumberList: removeDups(removeBillNumberList)
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
                    else {
                        return res.status(400).send({ message: "can not sell any lottert number" })
                    }
                }
                //____________________server offline______________________//
                else {
                    return res.status(501).send({ message: "server offline" })
                }
                done();
            } else {
                return res.status(500).send({ message: "server error", error: err })
            }

        })


    } catch (error) {
        await cleint.query(`ROLLBACK`)
        logger.error(error.stack)
        return res.status(500).send(error.stack)
    }

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
                    } else {
                        logger.error(error.stack)
                        return res.status(403).send(error.stack)
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


exports.GetSellSetNumber = (req, res) => {

    db.connect(async (err, client, done) => {
        let saleViewModelList = []
        let saleViewModel = {}
        let lotteryNumber = req.params.lotteryNumber
        let lotteryPrice = req.params.lotteryPrice

        if (!err) {
            try {

                if ('' + lotteryNumber.length <= 6) {

                    const lotteryData = client.query('SELECT * FROM tbl_set_number WHERE lottery_number = $1', [lotteryNumber])
                    if ('' + lotteryNumber.length < 3) {

                        if ((await lotteryData).rowCount == 0) {
                            saleViewModel = {
                                lotteryNumber: lotteryNumber,
                                lotteryPrice: lotteryPrice
                            }
                            saleViewModelList.push(saleViewModel)
                        }
                        else {

                            const lottery_name = (await lotteryData).rows[0].lottery_name                            
                            const saleNumberList = client.query(`SELECT  *  FROM tbl_set_number 
                                                                 WHERE      lottery_name = $1 
                                                                 AND        lottery_digit = $2`,
                                                                [lottery_name, lotteryNumber.length])

 
                                                                

                        }



                    }







                }


                done()
                return res.send({
                    saleViewModelList
                })

            } catch (error) {
                console.log(error)
            }

        }
    })

}


function removeDups(number) {
    let unique = {};
    number.forEach(function (i) {
        if (!unique[i]) {
            unique[i] = true;
        }
    });
    return Object.keys(unique);
}

