require('dotenv').config()

let DB_URI = process.env.DB_URI
const PORT = process.env.PORT || 3003

if (process.env.NODE_ENV === 'test') {
  DB_URI = process.env.TEST_DB_URI
}

module.exports = {
  DB_URI,
  PORT
}