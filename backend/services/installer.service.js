const conn = require("../config/dbConnection");
const fs = require("fs");
const path = require("path");

async function install() {
// Inside backend/services/installer.service.js:
// const queryFile = path.join(__dirname, "sql", "initial_queries.sql");
const queryFile = path.join(__dirname, "sql", "initial_queries.sql");
  const sql = fs.readFileSync(queryFile, "utf8");

  let finalMessage = {};

  try {
    await conn.query(sql);

    finalMessage.message = "All tables are created";
    finalMessage.status = 200;

  } catch (err) {

    console.log("SQL ERROR:", err.message);

    finalMessage.message = "Not all tables are created";
    finalMessage.status = 500;
  }

  return finalMessage;
}

module.exports = { install };