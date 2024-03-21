// dbconfig.js
const sql = require('mssql');

const config = {
    user: "mbudgetinguser",
    password: "Mijinitech@2024",
    server: "eu-az-sql-serv1.database.windows.net",
    database: "mbudgetingdb",
    options: {
        encrypt: true,
    }
}

sql.on("error", (error) => {
    console.log("error",error)
})

const pool = sql.connect(config, (error) => {
    if (error) {
        console.log('error', error.message)
        sql.close()
    } else {

        console.log("Db connected")
    }
})

module.exports = {
    sql, pool
};



