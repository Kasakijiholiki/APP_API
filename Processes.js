
const connection = require('./config-db/connection')
const logger = require('./config-log/logger')
//............POST................./
// const POST = async function (res, loggerinfo, SQL, Parameters) {
//     connection = connectionRQ()
//     logger.info(loggerinfo)
     
//     await connection.query(SQL, Parameters, (err, results) => {
//         if (err) {
//             logger.error(err);
//             res.status(403).send({ err: err })
//         }
//         else {
//             logger.info(results)
//             res.status(201).send(results)
//         }
//     });
// }
// //............GET................./
// let GET = async function (res, loggerinfo, SQL, Parameters) {
//     connection = connectionRQ()

//     logger.info(loggerinfo)

//     await connection.query(SQL, Parameters, (err, results) => {
//         if (err) {
//             logger.error(err);
//             res.status(403).send({ err: err })
//         }
//         if (results.rowCount == 0) {
//             res.status(404).send({ message: "Not found data Or data in database empty" })
//         }
//         else {
//             logger.info(results)
//             res.status(200).send({data:results.rows})
//         }
//     });
// }
//............PUT................./
let PUT = async function (res,loggerinfo,  SQL, Parameters) {

    logger.info(loggerinfo)
await connection.connect((err, cleint, done) => {
    
    cleint.query(SQL, Parameters, (err, results) => {
        if (err) {
            logger.error(err);
           return res.status(403).send({ err: err })
        }

        if (results.rowCount == 0) {
            return res.status(404).send({ message: "Not found data for update" })
        }

        else {
            logger.info(results)
            return res.status(200).send(results)
        }
    });
    done();
})
    
}

//............DELTE................./
// let DELETE = async function (res, loggerinfo, SQL, Parameters) {
//     connection = connectionRQ()

//     logger.info(loggerinfo)
//     await connection.query(SQL, Parameters, (err, results) => {
//         if (err) {
//             logger.error(err);
//             res.status(403).send({ err: err })
//         }
//         if (results.rowCount == 0) {
//             res.status(404).send({ message: "Not found data for delete" })
//         }
//         else {
//             logger.info(results)
//             res.status(200).send(results)
//         }
//     });
// }
module.exports = { PUT }