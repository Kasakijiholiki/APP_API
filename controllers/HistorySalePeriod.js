
const db = require('../config-db/connection')



exports.get = async (req, res) => {
    const { deviceCode, periodNumber } = req.params
    await db.connect(async (err, cleint, done) => {

        if (!err) {
            try {

                //#region  startPeriod
                let startPeriod = ""
                const _startPeriod = cleint.query(`SELECT to_char("date_online",'DD/MM/YYYY') as date_online 
                                   FROM   tbl_online
                                   WHERE period_number = $1`, [periodNumber])
                if ((await _startPeriod).rowCount > 0) {
                    startPeriod = (await _startPeriod).rows[0].date_online
                }
                //#endregion    


                //#region totalBill
                let totalBill = 0;
                const _billlist = cleint.query(`SELECT * 
                                              FROM  tbl_bill
                                              WHERE device_code = $1
                                              AND   period_number = $2`, [deviceCode, periodNumber])
                totalBill = (await _billlist).rowCount
                //#endregion


                //#region totalSell
                let totalSell = 0;
                const _totalSell = cleint.query(`SELECT SUM(bill_price)  AS total 
                                       FROM   tbl_bill
                                       WHERE  bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
                                       AND    device_code = $1 
                                       AND    period_number = $2`, [deviceCode, periodNumber])
                if ((await _totalSell).rows[0].total != null)
                    totalSell = (await _totalSell).rows[0].total


                //#endregion


                //#region maxSell
                let maxsell = 0;
                const _maxSell = cleint.query(`SELECT max_sell AS maxsell
                                               FROM tbl_device_max_sell
                                               WHERE device_code = $1 `, [deviceCode])
                maxsell = (await _maxSell).rows[0].maxsell
                maxsell = maxsell - totalSell;
                //#endregion


                //#region totalDigitSell
                let totalDigitSell;
                const _totalDigitSell = cleint.query(`  SELECT  tbl_bill.bill_id AS key,
                                                                LENGTH(tbl_bill_detail.lottery_number) AS digit,
	                                                            SUM(tbl_bill_detail.lottery_price) AS price
                                                        FROM tbl_bill, tbl_bill_detail
                                                        WHERE tbl_bill.bill_id = tbl_bill_detail.bill_id
                                                        AND tbl_bill.device_code =$1
                                                        AND tbl_bill.period_number = $2
                                                        AND LENGTH(tbl_bill_detail.lottery_number) <= 6
                                                        AND tbl_bill.date_bill = tbl_bill_detail.date_bill_detail
                                                        GROUP BY tbl_bill.bill_id, tbl_bill_detail.lottery_number
                                                        ORDER BY LENGTH(tbl_bill_detail.lottery_number) DESC
                `, [deviceCode, periodNumber])
                totalDigitSell = (await _billlist).rows
                //#endregion
                    

                //#region totalCancel
                let totalCancel = 0
                const _totalCancel = cleint.query(`SELECT count(*) FROM tbl_bill WHERE period_number = $1 AND device_code = $2`, [periodNumber, deviceCode])
                totalCancel = (await _totalCancel).rowCount
                //#endregion

               

                //#region billDetailList
                      //#region get bill
                        const _bill = cleint.query(`SELECT * FROM tbl_bill, tbl_bill_cancel `)
                       
                      //#endregion


                //#endregion


                return res.send({
                    maxsell: maxsell ,
                    startPeriod: startPeriod,
                    totalSell: totalSell,
                    totalBill: totalBill,
                    totalCancel: totalCancel,
                    totalDigitSell: totalDigitSell,
                    billDetailList: {}
                })

            } catch (error) {
                console.log(error)
            }

        }
    })
}


