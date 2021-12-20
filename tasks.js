
const connection = require('./config-db/connection')
const logger = require('./config-log/logger')
let PUT = async function (res, request, log, SQL, Parameters) {

    logger.info(request)
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {
            cleint.query(SQL, Parameters, (err, results) => {
                if (err) {
                    logger.error(err);
                    return res.status(403).send({ err: err })
                }
                if (results.rowCount == 0) {
                    return res.status(404).send({ message: "Not update" })
                }
                else {
                    logger.info(results)
                    return res.status(200).send(results.rows)
                }
            });
            done();
        } else {
            logger.error(err)
            return res.status(500).send({ message: 'Server error' })
        }
    })
}
//Get action
let GET = async function (res, request, log, SQL, Parameters) {

    logger.info(request)
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {
            cleint.query(SQL, Parameters, (err, results) => {
                if (err) {
                    logger.error(err);
                    return res.status(403).send({ err: err })
                }
                if (results.rowCount == 0) {
                    return res.status(404).send({ message: "Not found data" })
                }
                else {
                    logger.info(results)
                    return res.status(200).send(results.rows)
                }
            });
            done();
        } else {
            logger.error(err)
            return res.status(500).send({ message: 'Server error' })
        }
    })
}
//export method
module.exports = {GET, PUT}