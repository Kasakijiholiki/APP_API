


const getdate = function(){
    let date_ob = new Date();
    let _date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const date = year + '-' + month + '-' + _date
    // let today = new Date();
    // let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
    return date
}
const monthOnly = function() {
    let dol = new Date();
    let month = ("0" + (dol.getMonth() + 1)).slice(-2);
    return month
}
const yearOnly = function() {
    let yol = new Date();
    let year = yol.getFullYear();
    return year
}
const gettime = function(){

    let today = new Date();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    return time
}

module.exports = {getdate, gettime, monthOnly, yearOnly}