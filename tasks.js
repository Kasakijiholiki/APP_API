
const connection = require('./config-db/connection')
const logger = require('./config-log/logger')

//Create one action 
const POST = async function (res, request, log, SQL, Parameters) {

    logger.info(request)
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {
            cleint.query(SQL, Parameters, (err, results) => {

                if (err) {
                    logger.error(err);
                    return res.status(403).send({ err: err })
                }
                else {
                    return res.status(201).send({ message: "Created" })
                }
            });
            done();
        }
        else {
            return res.status(500).send({ message: 'Server error' })
        }
    })

}

//Create two table together PASS
const POST2 = async function (res, request, log, SQL, Parameters, SQL2, Parameters2,) {
    logger.info(request)
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {

            //First action
            cleint.query(SQL, Parameters, (err) => {
                if (err) {
                    logger.error(err);
                    return res.status(403).send({ message: "Error action1",err: err })
                }

                else {

                    //Second action
                    cleint.query(SQL2, Parameters2, (er) => {

                        if (er) {
                            logger.error(er);
                            return res.status(403).send({ message: "Error action2", err: er })
                        }
                        else {
                            return res.status(201).send({ message: 'Created' })
                        }
                    });
                }
            });
            done();
        }
        else {
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
            return res.status(500).send({ message: 'Server error' })
        }
    })
}
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
            return res.status(500).send({ message: 'Server error' })
        }
    })
}

 
//Update once action PASS
let PUT = async function (res, request, log, SQL, Parameters) {

    logger.info(request);
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {

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
                    return res.status(200).send({ message: "Updated" })
                }
            });
            done();
        }
        else {
            return res.status(500).send({ message: 'Server error' })
        }
    })

}
//Update 2 action together PASS
let PUT2 = async function (res, request, log, SQL, Parameters, SQL2, Parameters2) {

    logger.info(request);
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {

            //First action
            cleint.query(SQL, Parameters, (err, results) => {
                if (err) {
                    logger.error(err);
                    return res.status(403).send({ err: err })
                }
                if (results.rowCount == 0) {
                    return res.status(404).send({ message: "Not found data for update1" })
                }
                else {

                    //Second action
                    cleint.query(SQL2, Parameters2, (error) => {
                        if (error) {
                            logger.error(error);
                            return res.status(403).send({ err: error })
                        }
                        if (results.rowCount == 0) {
                            return res.status(404).send({ message: "Not found data for update2" })
                        }
                        else {
                            return res.status(200).send({ message: "Updated" })
                        }
                    });
                }
            });
            done();
        }
        else {
            return res.status(500).send({ message: 'Server error' })
        }

    })

}

//Delete action PASS
let DELETE = async function (res, request, log, SQL, Parameters) {

    logger.info(request);
    logger.info(log)

    await connection.connect((err, cleint, done) => {
        if (!err) {
            cleint.query(SQL, Parameters, (err, results) => {
                if (err) {
                    logger.error(err);
                    return res.status(403).send({ err: err })
                }
                if (results.rowCount == 0) {
                    return res.status(404).send({ message: "Not found data for delete" })
                }
                else {
                    logger.info(results)
                    return res.status(200).send({ message: "Deleted" })
                }
            });
            done();
        }
        else {
            return res.status(500).send({ message: 'Server error' })
        }
    })
}

//export method
module.exports = { POST, POST2, GET, DELETE, PUT, PUT2 }