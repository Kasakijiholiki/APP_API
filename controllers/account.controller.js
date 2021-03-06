

const connection = require('../config-db/connection')
const jwt = require('jsonwebtoken')
let account = require('../models/account.model')
let SQL = ``
const logger = require('../config-log/logger')
const bcrypt = require('bcrypt')
require('dotenv').config()
//.............Login......................//
exports.login = async (req, res) => {

     account = req.params
    logger.info(`POST/api/login/${account.device_code}/${account.us_pwd}`)

try{
    await connection.connect(async (err, cleint, done) => {
        if (!err) {
            let date_offline = ""
            let date_end     = ""
           
            const isonline =  cleint.query(`SELECT to_char("date_offline", 'DD/MM/YYYY') AS date_offline FROM tbl_online WHERE online_status = 1`)

            if ((await isonline).rowCount > 0) {

                date_offline = (await isonline).rows[0].date_offline
                date_end     = (await isonline).rows[0].date_end
                time_end     = (await isonline).rows[0].time_end

                 SQL = `SELECT * FROM  public.tbl_user_seller WHERE  device_code = $1 AND us_dlst = true`

                await cleint.query(SQL, [account.device_code], async (error, results) => {
                  
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

                            bcrypt.compare(account.us_pwd.toString(), results.rows[0].us_pwd, (error, response) => {

                                if (response) {
                                    const token = jwt.sign({ userId }, 'SCRET_KEY', {
                                        expiresIn: "24h"
                                    })
                                    return res.json({
                                        online: true,
                                        deviceCode: account.device_code,
                                        offlineDate: date_offline,
                                        date_end: date_end,
                                        isOverMaxSell: false,
                                        accessToken: token,
                                        setNumberList: setnumberList
                                    });
                                } else {
                                    return res.status(404).send({
                                        message: "Password incorrect!"
                                    })

                                }
                            })
                        }
                        else if (results.rows[0].us_status == 2) {
                            return res.status(405).send("Unauthorise")
                        }
                        else if (results.rows[0].us_status == 3) {
                            return res.status(406).send("Was blocked")
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
}catch(error) {
    logger.error(error)
}
}

//.....................PasswordChange..............//
//Change password
exports.changepasswpord = async (req, res) => {
   account = req.params
    await connection.connect(async (err, cleint, done) => {
        if (!err) {
            SQL = `SELECT * FROM tbl_user_seller WHERE device_code = $1`
            cleint.query(SQL, [account.device_code], (error, data) => {
                if(error) {
                    logger.error(error.stack)
                    return res.status(403).send({error: error.stack })
                } 
                else if(data.rowCount == 0) {
                    return res.status(404).send("not found")
                } else {
                        bcrypt.compare(account.us_pwd.toString(), data.rows[0].us_pwd, (e, response) => { 
                            if (!e && response) {
                                bcrypt.hash(account.us_newpwd.toString(), 10, (erro, hash) => {
                                    if (!erro) {
                                        SQL = `UPDATE tbl_user_seller SET us_pwd = $1 WHERE device_code = $2`
                                        cleint.query(SQL, [hash, account.device_code], (e, d) => {
                                            if(e) {
                                                  logger.error(e.stack)
                                                  return res.status(403).send({error: e.stack })
                                            }
                                            if (d.rowCount > 0) {
                                                return res.status(200).send({ message: "Success" })
                                            } else {
                                                return res.status(404).send({ message: "Not Update" })
                                            }
                                        })    
                                       
                                    } else {
                                        logger.error(erro)
                                        return res.status(501).send({message: "hash failed", error: erro.stack })
                                    }
    
                                });
                            } else {
                                logger.error(e)
                                return res.status(501).send({messsage: "Old password incorrect"})
                            }
                        })
                }
            })
            done();
        } else {
            logger.error(err.stack)
            return res.status(500).send({ message: "Server error", error: err.stack })
        }
    })
}


// exports.PasswordChage = async (req, res) => {
//     account = req.params
//     SQL = `UPDATE public.tbl_user_seller SET us_pwd = $1 WHERE device_code = $2 AND us_pwd = $3`

//     process.PUT(
//         res,
//         `POST/api/userpasswordchange/${account.device_code}/${account.us_pwd}/${account.us_newpwd}`,
//         ``,
//         SQL,
//         [account.us_newpwd, account.device_code, account.us_pwd]
//     )
// }
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
    SQL = `SELECT  tbl_device.device_number, tbl_device.device_code, tbl_branch_code.phone,
                   tbl_branch_code.branch_id, tbl_province.province_name , tbl_branch_code.branch_code
          FROM     tbl_branch_code, tbl_province, tbl_device, tbl_service_unit, tbl_user_seller
            WHERE  tbl_branch_code.province_id = tbl_province.provice_id
            AND   tbl_branch_code.branch_id   = tbl_service_unit.branch_id 
            AND   tbl_service_unit.su_id      = tbl_user_seller.unit_id
            AND   tbl_user_seller.device_code = tbl_device.device_code
            AND   tbl_device.device_imei      = $1
            AND   tbl_device.device_dlst      = true
            AND   tbl_branch_code.branch_dlst = true
            AND   tbl_service_unit.su_dlst    = true
            AND   tbl_user_seller.us_dlst     = true`

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
                        branchName: results.rows[0].province_name + " ????????? " + results.rows[0].branch_code,
                        isVersionLatest: isVersionLatest,
                        branchPhone: results.rows[0].phone
                    })
                }
            })
            done();
        } else {
            return res.status(500).send({ message: "Server error" })
        }
    })
}

