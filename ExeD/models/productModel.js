const { poolPromise } = require('./db');

exports.insertProduct = async (product) => {
  const pool = await poolPromise;
  await pool.request()
    .input('supplierId', product.supplierId)
    .input('productName', product.productName)
    .input('pricePerUnit', product.pricePerUnit)
    .input('minQuantity', product.minQuantity)
    .query(`
      INSERT INTO Products (supplier_id, product_name, unit_price, min_quantity)
      VALUES (@supplierId, @productName, @pricePerUnit, @minQuantity)
    `);
};

exports.getProductBySupplierId = async (supplierId) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('supplierId', supplierId)
    .query(`
      SELECT product_name, min_quantity, unit_price, id as product_id
      FROM Products 
      WHERE supplier_id = @supplierId
    `);
  return result.recordset;
};

exports.getProductById = async (productId) => {
  const pool = await poolPromise;
  try {
    const result = await pool.request()
      .input('productId', productId)
      .query(`
        SELECT unit_price, min_quantity
        FROM Products
        WHERE id = @productId;
      `);
    return result.recordset[0];
  } catch (err) {
    console.error('Error fetching product details:', err);
    throw err;
  }
};

exports.getCheapestSupplierForProduct = async (productName) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('productName', productName)
    .query(`
      SELECT TOP 1 id AS product_id, supplier_id, unit_price
      FROM Products
      WHERE product_name = @productName
      ORDER BY unit_price ASC
    `);

  return result.recordset[0]; 
};

exports.getSuppliersForProduct = async (productName) => {
  const pool = await poolPromise;
  const result = await pool.request()
    .input('productName', productName)
    .query(`
      SELECT supplier_id, id, unit_price, min_quantity 
      FROM products 
      WHERE product_name = @productName
    `);
  return result.recordset;
};

