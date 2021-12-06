
const db = require('../config-db/connection')

exports.isonline = async () => {
    let online = false
    await db.connect(async (err, cleint, done) =>{

        if (!err) {
           await cleint.query("SELECT * FROM tbl_online WHERE online_status = 1", "",  (error, results) => {

                if (error) {
                    return res.status(403).send({ message: error.stack })
                } if (results.rowCount > 0) {
                    online = true
                } 
              
            })
            done()
        }
    })

    return online
}
