
const db = require('../config-db/connection')
const logger = require('../config-log/logger')
let online = "00"
//Check is online or not
const isonline = function () {
   
    db.connect((err, cleint, done) => {
        if (!err) {
            cleint.query("SELECT online_status FROM tbl_online WHERE online_status = 1", "", (error, results) => {
                
                if (error) {
                    logger.error(error)
                    return res.status(403).send({ message: error })
                } if (results.rowCount > 0) {
                    online = "true"
                } else {
                    online = "true"
                }

                return online
            })
            done();
        }
    })
    
}
module.exports = { isonline }