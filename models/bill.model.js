
const date = require('../getdate/datenow')
const { v4: uuidv4 } = require('uuid');
const  bill = {
    bill_id: uuidv4(),
    bill_number: String,
    period_number: String,
    device_code: String,
    device_ref: String,
    bill_price: 0,
    date_bill: date.getdate(),
    time_bill: date.gettime(),
    branch_id: 0,
    unit_id: 0,
    ref_code: 0,
    lottery_number: String,
    lottery_price: 0
}
module.exports = bill