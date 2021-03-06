

const logger = require('../config-log/logger')
const db = require('../config-db/connection')

exports.get = async (req, res) => {
    const { deviceCode, periodNumber } = req.params
    await db.connect(async (err, client, done) => {

        if (!err) {
            try {

                //#region  startPeriod
                let startPeriod = ""
                const _startPeriod = client.query(`SELECT to_char("date_online",'DD/MM/YYYY') as date_online 
                                   FROM   tbl_online
                                   WHERE period_number = $1`, [periodNumber])
                if ((await _startPeriod).rowCount > 0) {
                    startPeriod = (await _startPeriod).rows[0].date_online
                }
                //#endregion    


                //#region totalBill
                let totalBill = 0;
                let bill = ""
                const _billlist = client.query(`SELECT * 
                                              FROM  tbl_bill
                                              WHERE device_code = $1
                                              AND   period_number = $2`, [deviceCode, periodNumber])
                if ((await _billlist).rowCount > 0) {
                    totalBill = (await _billlist).rowCount
                    bill = (await _billlist).rows
                }
                //#endregion


                //#region totalSell
                let totalSell = '';
                const _totalSell = client.query(`SELECT SUM(bill_price)  AS total 
                                       FROM   tbl_bill
                                       WHERE  bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
                                       AND    device_code = $1 
                                       AND    period_number = $2`, [deviceCode, periodNumber])
                if ((await _totalSell).rows[0].total != null)
                    totalSell = (await _totalSell).rows[0].total                 
                //#endregion

                //#region maxSell
                let maxsell = 0;
                const _maxSell = client.query(`SELECT max_sell AS maxsell
                                               FROM tbl_device_max_sell
                                               WHERE device_code = $1 `, [deviceCode])
                maxsell = (await _maxSell).rows[0].maxsell
                maxsell = maxsell - totalSell;


                //#region totalDigitSell
                let totalDigitSell;
                const _totalDigitSell = client.query(`  SELECT   
                                                                LENGTH(tbl_bill_detail.lottery_number) AS digit,
	                                                            SUM(tbl_bill_detail.lottery_price) AS price
                                                        FROM tbl_bill, tbl_bill_detail
                                                        WHERE tbl_bill.bill_id = tbl_bill_detail.bill_id
                                                        AND tbl_bill.device_code =$1
                                                        AND tbl_bill.period_number = $2
                                                        AND LENGTH(tbl_bill_detail.lottery_number) <= 6
                                                        AND tbl_bill.date_bill = tbl_bill_detail.date_bill_detail
                                                        GROUP BY LENGTH(tbl_bill_detail.lottery_number)
                                                        ORDER BY LENGTH(tbl_bill_detail.lottery_number) DESC
                `, [deviceCode, periodNumber])
                if ((await _totalDigitSell).rowCount > 0)
                totalDigitSell = (await _totalDigitSell).rows
                //#endregion


                //#region totalCancel
                let totalCancel = 0
                const _totalCancel = client.query(`SELECT * FROM tbl_bill_cancel WHERE period_number = $1 AND device_code = $2`, [periodNumber, deviceCode])
                if ((await _totalCancel).rowCount!= 0){
                    totalCancel = (await _totalCancel).rowCount
                }
                //#endregion

                //#region  billDetailList

                const _billDetailList = client.query(`
                SELECT 
                      CASE
                          WHEN  tbl_bill_cancel.cancel_by IS NOT NULL THEN tbl_bill_cancel.cancel_id
                          WHEN  tbl_bill_cancel.cancel_by IS  NULL THEN tbl_bill.bill_id
                          END  AS key,
                      tbl_bill.bill_number AS billNUmber,
                      CONCAT(TO_CHAR("date_bill", 'DD/MM/YYYY'), ' ',time_bill)  AS dateTime,
                      tbl_bill.bill_price AS billPrice,
                      CASE 
                          WHEN tbl_bill_cancel.cancel_by IS NULL THEN '?????????????????????'
                          WHEN tbl_bill_cancel.cancel_by = '0'   THEN  '${deviceCode}:?????????????????????' 
                          ELSE '??????????????????????????????????????????'
                          END AS billStatus,
                     CASE 
                          WHEN tbl_bill_cancel.cancel_by IS NULL THEN true
                          ELSE false
                          END AS isLast,
                     CASE 
                          WHEN tbl_bill_cancel.cancel_by IS NOT NULL THEN true
                          ELSE false
                          END AS isCancel
                FROM  tbl_bill
                LEFT JOIN tbl_bill_cancel
                ON tbl_bill.bill_number = tbl_bill_cancel.bill_number
                WHERE tbl_bill.device_code = $1
                AND   tbl_bill.period_number = $2`, [deviceCode, periodNumber] )

                //#endregion                
                return res.send({
                    maxsell: maxsell,
                    startPeriod: startPeriod,
                    totalSell: totalSell,
                    totalBill: totalBill,
                    totalCancel: totalCancel,
                    totalDigitSell: totalDigitSell,
                    billDetailList: (await _billDetailList).rows
                })
            } catch (error) {
                logger.error(error)           
                return res.status(500).send('Database Error');
            }

        } else {
            logger.error(err)
            return res.status(500).send('Server error');

        }
    })
}


