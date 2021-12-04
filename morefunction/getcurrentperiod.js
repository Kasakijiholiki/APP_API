
const db = require('../config-db/connection')

let period = ""
exports.getcurrentperiod = () => {

    db.connect((err, con, done) => {
        if (!err) {
            con.query(`SELECT period_number FROM tbl_online WHERE online_status = 1  ORDER BY online_id DESC `, (error, result) => {
                if (result.rowCount > 0) {
                    period = result.rows[0].period_number
                }
            })
            done();
        }
    })
    return period
}

