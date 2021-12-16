

const connection = require('../config-db/connection')
const jwt = require('jsonwebtoken')
let account = require('../models/account.model')
let SQL = ``
const logger = require('../config-log/logger')
const process = require('../tasks')
const bcrypt = require('bcrypt')
require('dotenv').config()
//.............Login......................//
exports.login = async (req, res) => {

    const { device_code, us_pwd } = req.params

    // account = req.params
    logger.info(`POST/api/login/${device_code}/${us_pwd}`)

    await connection.connect(async (err, cleint, done) => {
        if (!err) {
            let date_offline = ""
            const isonline =  cleint.query(`SELECT to_char("date_offline", 'DD/MM/YYYY') AS date_offline FROM tbl_online WHERE online_status = 1`)

            if ((await isonline).rowCount > 0) {
                date_offline = (await isonline).rows[0].date_offline

                 SQL = `SELECT * FROM  public.tbl_user_seller WHERE  device_code = $1`
                await cleint.query(SQL, [device_code], async (error, results) => {

                    if (error) {
                        logger.error(error.stack)
                        return res.status(403).send({ error: error })
                    }
                    if (results.rowCount == 0) {
                        return res.status(404).send({ message: 'User not found' })
                    }
                    else {
                        if (results.rows[0].us_status == 1) {
                            const userId = results.rows[0].usid
                            const setnumberList = (await cleint.query(`SELECT * FROM public.tbl_set_number`)).rows

                            bcrypt.compare(us_pwd, results.rows[0].us_pwd, (error, response) => {

                                if (response) {
                                    const token = jwt.sign({ userId }, 'SCRET_KEY', {
                                        expiresIn: "24h"
                                    })
                                    return res.json({
                                        online: true,
                                        deviceCode: device_code,
                                        offlineDate: date_offline,
                                        isOverMaxSell: false,
                                        accessToken: token,
                                        setNumberList: setnumberList
                                    });
                                } else {
                                    return res.status(404).send({
                                        auth: false,
                                        message: "Password incorrect!"
                                    })

                                }
                            })
                        }
                        else if (results.rows[0].us_status == 2) {
                            return res.status(501).send("Unauthorise")
                        }
                        else if (results.rows[0].us_status == 3) {
                            return res.status(502).send("Was blocked")
                        }
                    }
                });
            } else {
                return res.status(503).send("server offline")
            }
            done();
        } else {
            logger.error(err)
            return res.status(500).send("Server error")
        }
    })

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
             AND   tbl_device.device_imei      = $1
             AND   tbl_device.device_dlst      = true
             AND   tbl_branch_code.branch_dlst = true
             `

    await connection.connect((err, cleint, done) => {
        if (!err) {
            cleint.query(SQL, [account.device_imei], (error, results) => {

                if (error) {
                    logger.error(error)
                    return res.status(403).send({ error: error })

                }
                if (results.rowCount == 0) {
                    return res.status(404).send(false)
                }
                else {
                    return res.json({
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

