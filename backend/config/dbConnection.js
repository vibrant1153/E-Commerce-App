const {Pool} = require('pg')
require('dotenv').config()


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT,
});

// module.exports = pool

async function query(sql, params){
    const result = await pool.query(sql,params)
    const rows = result.rows
    // console.log(pool.password)
    console.log(" Query executed successfully")
    return rows
}

function connect() {
  return pool.connect();
}

module.exports = { query,connect }