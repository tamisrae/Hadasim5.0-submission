const { poolPromise } = require('./db');

exports.getSupplierByUsername = async (username) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('username', username)
    .query(`
      SELECT 
        u.id AS user_id, 
        s.id AS supplier_id, 
        u.password
      FROM Users u
      LEFT JOIN Suppliers s ON u.id = s.user_id
      WHERE u.username = @username
    `);

  const user = result.recordset[0];

  return {
    user_id: user.user_id,
    supplier_id: user.supplier_id,//||null
    password: user.password
  };
};

exports.getAllSuppliers = async () => {
  const pool = await poolPromise;
  const result = await pool.request()
    .query(`
      SELECT sp.id AS supplier_id, u.username
      FROM Suppliers sp
      JOIN Users u ON sp.user_id = u.id
    `);
  return result.recordset;
};

exports.getSupplierById = async (supplierId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('supplierId', supplierId)
    .query(`
      SELECT sp.*, u.username 
      FROM Suppliers sp
      JOIN Users u ON sp.user_id = u.id
      WHERE sp.id = @supplierId
    `);
  return result.recordset[0];
};
