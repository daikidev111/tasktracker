
module.exports = function(){
    const mysql = require("mysql");
    
    
    // Information of database to be connected  
    const pool = mysql.createPool({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE
    })

    return pool;
}