require('dotenv').config();
const mysql = require("mysql2");

const db = process.env.SQL_DB;

const connection = mysql.createConnection({
    user: process.env.SQL_USER,
    host: process.env.SQL_HOST,
    password: process.env.SQL_PWD,
    database: db,
});

connection.connect(err=>{
    if(err){
        console.log(err);
        return;
    }
    console.log(`We're connected to ${db} on MySQL`);
})

const execute = (sql, params = [])=>{
    return new Promise((resolve, reject)=>{
        connection.execute(sql, params, (err, result)=>{
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        })
    })
}

module.exports = {execute}