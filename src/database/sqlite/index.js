const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')

// O path ele resolve os endereços de pastas de acordo com o ambiente ou sistema operacional
const path = require('path')

async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, '..', 'database.db'),

    driver: sqlite3.Database
  })

  return database
}

module.exports = sqliteConnection
