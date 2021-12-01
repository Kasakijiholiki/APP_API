//Delete first before test POST method. This just use for test only
const DB = require('./DBConfig/connection');
var query = ""
exports.delete = function (tableName, Id, Cause) {
  DB.connect((err, client, done) => {
    if (!err) {
       query =  client.query(`DELETE FROM ${tableName} WHERE ${Id} = ${Cause}`)
       done();
    }
  })
 return query
}






