

const connection = require('../config-db/connection')
const jwt = require('jsonwebtoken')
let account = require('../models/account.model')
let SQL = ``
const logger = require('../config-log/logger')
const process = require('../tasks')

//.............Login......................//
exports.login = async (req, res) => {
    const cleint = await connection.connect()
    account = req.params
    logger.info(`POST/api/login/${account.device_code}/${account.us_pwd}`)

    SQL = `SELECT * FROM  public.tbl_user_seller WHERE  device_code = $1 AND us_pwd = $2`

    try {
        cleint.query(SQL, [account.device_code, account.us_pwd], (error, results) => {
            if (error) {
                logger.error(error)
                return res.status(403).send({ error: error })
            }
            if (results.rowCount == 0) {
                return res.status(404).send({ message: 'User not found' })
            }
            else {
                SQL = `SELECT * FROM public.tbl_set_number`
                cleint.query(SQL, async (err, rs) => {
                    if (err) {
                        return res.status(403).send({ error: err.stack })
                    } else {

                        //Query date offline from tbl_online
                        let date_offline = ""
                        const _date = cleint.query(`SELECT date_offline FROM tbl_online WHERE online_status = 1 DESC`)
                        if ((await _date).rowCount > 0) date_offline = (await _date).rows[0].date_offline

                        jwt.sign({ account }, 'secretkey', (err, accessToken) => {
                            if (!err) {
                                res.json({
                                    online: true,
                                    deviceCode: account.device_code,
                                    offlineDate: date_offline,
                                    isOverMaxSell: false,
                                    accessToken: accessToken,
                                    setNumberList: rs.rows
                                });
                            } else {
                                return res.status(403).send({ error: err.stack })
                            }
                        });
                    }

                })

            }

        });
    } catch (error) {

    } finally {
        cleint.release()
    }


}
//.....................PasswordChange..............//
exports.PasswordChage = async (req, res) => {
    account = req.params
    SQL = `UPDATE public.tbl_user_seller SET us_pwd = $1 WHERE device_code = $2 AND us_pwd = $3`

    process.PUT(
        res,
        `POST/api/userpasswordchange/${account.device_code}/${account.us_pwd}/${account.us_newpwd}`,
        ``,
        SQL,
        [account.us_newpwd, account.device_code, account.us_pwd]
    )
}
//..................CheckVersion..................//
exports.checkversion = async (req, res) => {

    account = req.params

    SQL = `SELECT * FROM public.tbl_version_mobile WHERE version_name = $1`

    logger.info(`GET/api/account/CheckVersion/${account.version_name}`)

    await connection.connect((err, cleint, done) => {

        if (!err) {
            cleint.query(SQL, [account.version_name], (error, results) => {
                if (error) {
                    logger.error(error)
                    return res.status(403).send({ error: error })
                }

                if (results.rowCount == 0) {
                    return res.status(404).send(false)
                }

                else {
                    return res.status(200).send(true)
                }

            })
            done();
        } else {
            return res.status(500).send({ message: "Server error" })
        }

    })


}

//...........Check device imei..............//
exports.CheckVersionV2 = async (req, res) => {

    let isVersionLatest = true;
    account = req.params

    //Check version of app
    SQL = `SELECT * FROM tbl_version_mobile WHERE version_name = $1`
    await connection.connect((err, cleint, done) => {

        if (!err) {
            cleint.query(SQL, [account.version_name], (error, results) => {

                if (error) {
                    logger.error(error)
                    return res.status(403).send({ error: error })
                }

                if (results.rows > 0 && results.rows[0].version_status == 1)
                    isVersionLatest = true
            })
            done();
        } else {
            return res.status(500).send({ message: "Server error" })
        }

    })
    logger.info(`GET/api/account/CheckVersionV2/${account.version_name}/${account.device_imei}`)

    //Check device imei of devive
    SQL = `SELECT  tbl_device.device_number, tbl_device.device_code,
                   tbl_branch_code.branch_id, tbl_province.province_name , tbl_branch_code.branch_code
           FROM    tbl_branch_code, tbl_province, tbl_device
           WHERE   tbl_branch_code.province_id = tbl_province.provice_id
             AND   tbl_branch_code.branch_id   = tbl_device.branch_id 
             AND   tbl_device.device_imei      = $1`

    await connection.connect((err, cleint, done) => {
        if (!err) {
            cleint.query(SQL, [account.device_imei], (error, results) => {

                if (error) {
                    logger.error(error)
                    return res.status(403).send({ error: error })

                }
                if (results.rowCount == 0) {
                    return res.status(404).send({ message: 'Not found' })
                }
                else {
                    res.json({
                        device_number: results.rows[0].device_number,
                        device_code: results.rows[0].device_code,
                        branch_id: results.rows[0].device_branch_id,
                        branchName: results.rows[0].province_name + " ເລກ " + results.rows[0].branch_code,
                        isVersionLatest: isVersionLatest
                    })
                }
            })
            done();
        } else {
            return res.status(500).send({ message: "Server error" })
        }
    })
}

