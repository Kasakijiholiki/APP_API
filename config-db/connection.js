
   const Pool = require('pg').Pool

    const connection = new Pool({
        user: 'postgres',
        host: '49.0.198.122',
        database: 'DBWeblottery',
        password: 'password',
        port: 5432,
    });
    
    module.exports = connection

