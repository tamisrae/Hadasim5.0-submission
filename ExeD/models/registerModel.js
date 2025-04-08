const { poolPromise } = require('./db');

exports.insertSupplier = async (supplier) => {
  const pool = await poolPromise;

  const userResult = await pool.request()
    .input('username', supplier.username)
    .input('password', supplier.password)
    .input('isSupplier', true)
    .query(`
      INSERT INTO Users (username, password, isSupplier)
      OUTPUT INSERTED.id
      VALUES (@username, @password, @isSupplier)
    `);

  const userId = userResult.recordset[0].id;

  const supplierResult = await pool.request()
    .input('company_name', supplier.company_name)
    .input('phone_number', supplier.phone_number)
    .input('representative_name', supplier.representative_name)
    .input('user_id', userId)
    .query(`
      INSERT INTO Suppliers (company_name, phone_number, representative_name, user_id)
      OUTPUT INSERTED.id
      VALUES (@company_name, @phone_number, @representative_name, @user_id)
    `);

  return {
    supplier_id: supplierResult.recordset[0].id,
    user_id: userId
  };
};

exports.getSupplierByUsername = async (username) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('username', username)
    .query(`
      SELECT s.*, u.username, u.password
      FROM Suppliers s
      JOIN Users u ON s.user_id = u.id
      WHERE u.username = @username
    `);
  return result.recordset[0];
};
