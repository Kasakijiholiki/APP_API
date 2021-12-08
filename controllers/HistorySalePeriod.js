
const { Console } = require('winston/lib/winston/transports')
const db = require('../config-db/connection')
const { billlist } = require('./dashboard')



exports.get = async (req, res) => {
    const { deviceCode, periodNumber } = req.params
    await db.connect(async (err, cleint, done) => {

        if (!err) {
            try {
                // //total sell And totalBill
                // let totalSell = 0
                // let totalBill = 0

                // const _totalSell = cleint.query(`SELECT SUM(bill_price)  AS total 
                //                                  FROM   tbl_bill
                //                                  WHERE  bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
                //                                  AND    device_code = $1 
                //                                  AND    period_number = $2`, [deviceCode, periodNumber])

                // if ((await _totalSell).rows[0].total != null) {
                //     totalSell = (await (await _totalSell).rows[0].total);
                // }

                // const _totalBill = cleint.query(` SELECT COUNT(*) 
                //                                   FROM   tbl_bill
                //                                   WHERE  period_number = $1 
                //                                   AND    device_code = $2`, [deviceCode, periodNumber])


                // //total Cancel
                // // let totalCancel = 0
                // // const _totalCancel = cleint.query(`SELECT count(*) FROM tbl_bill WHERE period_number = $1, AND device_code = $2`, [periodNumber, deviceCode])
                // // totalCancel = (await _totalCancel).rowCount

                // // let max_length = 0
                // // const _max_length = cleint.query(`SELECT max_length FROM tbl_digit_lenght`)
                // // if((await _max_length).rowCount > 0){
                // //     max_length = (await _max_length).rows[0].max_length
                // // }
                // //max sell

                // let max_Sell = 0
                // const _maxSell = cleint.query(`SELECT max_sell FROM tbl_device_max_sell WHERE device_code = $1`, [deviceCode])
                // if ((await _maxSell).rowCount > 0) {
                //     max_Sell = (await _maxSell).rows[0].max_sell
                // }
                // const maxSell = max_Sell;



                // let startPeriod = ""
                // const _startPeriod = cleint.query(`SELECT to_char("date_online",'DD/MM/YYYY') as date_online 
                //                                    FROM   tbl_online
                //                                    WHERE period_number = $1`, [periodNumber])
                // if ((await _startPeriod).rowCount > 0) {
                //     startPeriod = (await _startPeriod).rows[0].date_online
                // }

                let billlist = 0, totalBill = 0;
                const _billlist = cleint.query(`SELECT * 
                                                FROM  tbl_bill
                                                WHERE device_code = $1
                                                AND   period_number = $2`, [deviceCode, periodNumber])
                totalBill = (await _billlist).rowCount       
                
                


                let maxsell = 0;
                const _maxSell = cleint.query(`SELECT max_sell AS maxsell
                                               FROM tbl_device_max_sell
                                               WHERE device_code = $1 `, [deviceCode])


                                               
                maxsell = (await _maxSell).rows[0].maxsell
                 



                return res.send({
                    maxsell: maxsell,
                    startPeriod: 0,
                    totalSell: 0,
                    totalBill: totalBill,
                    totalCancel: 0,
                    totalDigitSell: {},
                    billDetailList: {}
                })

            } catch (error) {
                console.log(error)
            }

        }
    })
}


