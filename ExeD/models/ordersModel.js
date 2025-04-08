const { poolPromise } = require('./db');

exports.getSupplierOrders = async (supplierId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('supplierId', supplierId) 
    .query(`
      SELECT o.*, s.name AS status_name, u.username AS supplier_username
      FROM Orders o
      JOIN Status s ON o.status_id = s.id
      LEFT JOIN Suppliers sp ON o.supplier_id = sp.id
      LEFT JOIN Users u ON sp.user_id = u.id
      WHERE o.supplier_id = @supplierId 
    `);
  return result.recordset;
};

exports.getAllOrders = async (supplierId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('supplierId', supplierId) 
    .query(`
      SELECT o.*, s.name AS status_name, u.username AS supplier_username
      FROM Orders o
      JOIN Status s ON o.status_id = s.id
      LEFT JOIN Suppliers sp ON o.supplier_id = sp.id
      LEFT JOIN Users u ON sp.user_id = u.id
    `);
  return result.recordset;
};

exports.getOrderWithProducts = async (orderId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('orderId', orderId)
    .query(`
      SELECT p.product_name, oi.*
      FROM OrderItems oi
      JOIN Products p ON oi.product_id = p.id
      WHERE oi.order_id = @orderId
    `);
  return result.recordset;
};

exports.getOrderDetails = async (orderId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('orderId', orderId)
    .query(`
      SELECT 
        o.*,
        s.name AS status_name,
        u.username AS supplier_username
      FROM Orders o
      JOIN Status s ON o.status_id = s.id
      LEFT JOIN Suppliers sup ON o.supplier_id = sup.id
      LEFT JOIN Users u ON sup.user_id = u.id
      WHERE o.id = @orderId
    `);
  return result.recordset[0];
};

exports.updateOrderStatus = async (orderId, statusId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('orderId', orderId)
    .input('statusId', statusId)
    .query(`
      UPDATE Orders
      SET status_id = @statusId
      WHERE id = @orderId
    `);
  return result.rowsAffected;
};

exports.createOrder = async (supplier_id) => {
  const pool = await poolPromise;
  try {
    const result = await pool.request()
      .input('supplier_id', supplier_id)
      .query(`
        INSERT INTO orders (supplier_id, order_date)
        OUTPUT inserted.*
        VALUES (@supplier_id, GETDATE())
      `);
    return result.recordset[0];
  } catch (err) {
    console.error('Error creating order:', err);
    throw err;
  }
};

exports.addItemToOrder = async (orderId, productId, quantity, unitPrice) => {
  const pool = await poolPromise;
  try {
    const result = await pool.request()
      .input('orderId', orderId)
      .input('productId', productId)
      .input('quantity', quantity)
      .input('unitPrice', unitPrice)
      .query(`
        INSERT INTO OrderItems (order_id, product_id, quantity, unit_price)
        VALUES (@orderId, @productId, @quantity, @unitPrice);
      `);
    return result.recordset;
  } catch (err) {
    console.error('Error inserting order item:', err);
    throw err;
  }
};


exports.insertOrderItem = async (orderId, item) => {
  const pool = await poolPromise;
  await pool.request()
    .input('orderId', orderId.id)
    .input('productId', item.id)
    .input('quantity', item.quantity)
    .input('unitPrice', item.unit_price)
    .query(`
      INSERT INTO OrderItems (order_id, product_id, quantity, unit_price)
      VALUES (@orderId, @productId, @quantity, @unitPrice)
    `);
};



