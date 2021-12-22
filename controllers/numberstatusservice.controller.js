const db = require('../config-db/connection')
const logger = require('../config-log/logger')

//
exports.getnumberList = async (req, res) => {

    await db.connect(async (err, cleint, done) => {
        if (!err) {
            
            let maxlenght = ""
            const _maxlenght = cleint.query(`SELECT max_lenght FROM tbl_digit_lenght`)

            if ((await _maxlenght).rowCount > 0) maxlenght = (await _maxlenght).rows[0].max_lenght

            let periodNumber = cleint.query(`SELECT * FROM tbl_online WHERE online_status = 1 OR online_status = 2 ORDER BY online_id DESC`)

            const _lotteryNumberList = (await cleint.query(`SELECT * FROM tbl_lottery_number WHERE ln_status = 1 ORDER BY Length(lottery_number)`)).rows

            let highestCount = 0

            let lotCount = (await cleint.query(`SELECT count(Length(lottery_number)) AS count FROM tbl_lottery_number GROUP BY Length(lottery_number)`)).rows

            for (let i = 0; i < lotCount.length; i++) {
                if (i == 0) highestCount = lotCount[i].count
                else lotCount[i] > highestCount ? lotCount[i] : highestCount
            }
            let viewModelList = []
            let totalRecords = 0
            for (let j = 0; j < _lotteryNumberList.length; j++) {
                console.log(_lotteryNumberList[j].lottery_number)
                const bdList = (await cleint.query(`
                                                    SELECT 
                                                    count(*) AS count,  
                                                    sum(tbl_bill_detail.lottery_price) AS sum, 
                                                    Length(lottery_number) AS length
                                                    FROM tbl_bill, tbl_bill_detail 
                                                    WHERE tbl_bill.period_number = $1
                                                    AND tbl_bill_detail.lottery_number = $2
                                                    AND tbl_bill.bill_number = tbl_bill_detail.bill_number
                                                    group by  Length(lottery_number)`, [periodNumber, _lotteryNumberList[j].lottery_number])).rows

                if (bdList.length != 0) {
                    totalRecords += 1
                    viewModelList.push({
                        key: bdList[j].length,
                        highestCount: parseInt(highestCount),
                        list: {
                            lotteryNumber: _lotteryNumberList[j].lottery_number,
                            lotteryPrice: bdList[0].count > 0 ? (_lotteryNumberList[j].max_sell - bdList.sum) : _lotteryNumberList.max_sell
                        }
                    })
                }
            }
            done();
            return res.status(200).send({
                status: true,
                statusCode: 200,
                message: "OK",
                totalRecords: totalRecords,
                data: viewModelList
            })

        } else {
            logger.error(err.stack)
            return res.status(500).send({ message: "Connect DB F", error: err.stack })
        }
    })
}