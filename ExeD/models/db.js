const sql = require('mssql');

const config = {
  user: 'tamisrae_SQLLogin_1',
  password: 'j2e3xjvylq',
  server: 'supermarket.mssql.somee.com',
  database: 'supermarket',
  options: {
    encrypt: true,
    enableArithAbort: true,
    trustServerCertificate: true
  }
};

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed!', err));

module.exports = {
  sql, poolPromise
};
