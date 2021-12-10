
const db = require('../config-db/connection')

const isonline =  async () => {
    let online = false
    await db.connect( async (err, cleint, done) => {
        if(!err) {
            const data = db.query("SELECT * FROM tbl_online")

            if ((await data).rowCount > 0) {
        
                online = true
        
            }
        }
        online = true
    })

    return online
}
module.exports = {isonline}