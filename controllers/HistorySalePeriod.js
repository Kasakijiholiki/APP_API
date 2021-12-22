

const logger = require('../config-log/logger')
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
                let bill = ""
                const _billlist = cleint.query(`SELECT * 
                                              FROM  tbl_bill
                                              WHERE device_code = $1
                                              AND   period_number = $2`, [deviceCode, periodNumber])
                if ((await _billlist).rowCount > 0) {
                    totalBill = (await _billlist).rowCount
                    bill = (await _billlist).rows[0]
                }
                console.log('Hi ' + bill)

                //#region totalSell
                let totalSell = 0;
                const _totalSell = cleint.query(`SELECT SUM(bill_price)  AS total 
                                       FROM   tbl_bill
                                       WHERE  bill_number NOT IN (SELECT bill_number FROM tbl_bill_cancel)
                                       AND    device_code = $1 
                                       AND    period_number = $2`, [deviceCode, periodNumber])
                if ((await _totalSell).rows[0].total != null)
                    totalSell = (await _totalSell).rows[0].total
                //#region maxSell
                let maxsell = 0;
                const _maxSell = cleint.query(`SELECT max_sell AS maxsell
                                               FROM tbl_device_max_sell
                                               WHERE device_code = $1 `, [deviceCode])
                maxsell = (await _maxSell).rows[0].maxsell
                maxsell = maxsell - totalSell;


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
                totalDigitSell = (await _totalDigitSell).rows
                //#region totalCancel
                let totalCancel = 0
                const _totalCancel = cleint.query(`SELECT count(*) FROM tbl_bill WHERE period_number = $1 AND device_code = $2`, [periodNumber, deviceCode])
                totalCancel = (await _totalCancel).rowCount
                //#endregion
                let billDetailList = ""
                let lj_cancel = null
                let lastBill = null

                //#region get bill
                const _bill = cleint.query(`    
                        SELECT  tbl_bill.bill_id AS key, 
                                tbl_bill_cancel.cancel_id,
                                tbl_bill_cancel.cancel_by,
                                tbl_bill.bill_number,
                                CONCAT(
                                    to_char("date_bill",'DD/MM/YYYY'), ' ',
                                    tbl_bill.time_bill
                                    ) AS dateTime
                         FROM    tbl_bill, tbl_bill_cancel 
                         WHERE tbl_bill.bill_number = tbl_bill_cancel.bill_number
                        `)
                if ((await _bill).rowCount > 0) {
                    lj_cancel = (await _bill).rows
                }
                //#region LastBill
                const _lastBill = cleint.query(`SELECT bill_number
                                                FROM  tbl_bill
                                                WHERE device_code = $1
                                                AND   period_number = $2
                                                ORDER BY bill_number DESC `, [deviceCode, periodNumber])
                if ((await _lastBill).rowCount > 0) {
                    lastBill = (await _lastBill).rows
                }
            
                billDetailList = {
                    key: (lj_cancel != null && lj_cancel.cancel_by == 0) ? lj_cancel.cancel_id : bill == "" ? bill.bill_id : "",
                    billNumber: bill != "" ? bill.bill_number : "",
                    dateTime: lj_cancel.dateTime,
                    billPrice: bill == "" ? bill.bill_price : "",
                    billStatus: lj_cancel == null ? "ປົກກະຕິ" : (lj_cancel.cancel_by == 0 ? `${deviceCode} (ຍົກເລິກ)` : "ແອັບມິນຍົກເລີກ"),
                    isLast: bill != "" ? (lastBill.bill_number == bill.bill_number) && (lj_cancel == null) : "",
                    isCancel: lj_cancel != null && (lj_cancel.cancel_by == 0 || lj_cancel.cancel_by == 1)
                }
        
                done();
                const dataTest = {
                    "maxSell": -25000,
                    "startPeriod": "22/07/2021",
                    "totalSell": "25000",
                    "totalBill": "2",
                    "totalCancel": "0",
                    "totalDigitSell": [
                      {
                        "key": "9f13a7aa-cd29-4919-b664-0e51626dbbb8",
                        "digit": 2,
                        "price": 25000
                      }
                    ],
                    "billDetailList": [
                      {
                        "key": "9f13a7aa-cd29-4919-b664-0e51626dbbb8",
                        "billNumber": "21057218080080006",
                        "dateTime": "26/07/2021 18:33:42",
                        "billPrice": "15000",
                        "billStatus": "ປົກກະຕິ",
                        "isLast": true,
                        "isCancel": false
                      },
                      {
                        "key": "1e2711bd-f79a-4982-9d29-f3a40208bdf4",
                        "billNumber": "21057218080080005",
                        "dateTime": "26/07/2021 16:52:10",
                        "billPrice": "10000",
                        "billStatus": "ປົກກະຕິ",
                        "isLast": false,
                        "isCancel": false
                      }
                    ]
                  }
                return res.send(
                    dataTest
                    // maxsell: maxsell,
                    // startPeriod: startPeriod,
                    // totalSell: totalSell,
                    // totalBill: totalBill,
                    // totalCancel: totalCancel,
                    // totalDigitSell: totalDigitSell,
                    // billDetailList: billDetailList
                )

            } catch (error) {
                logger.error(error)
            }

        } else {
            logger.error(err)
        }
    })
}


