const { poolPromise } = require('./db');

  exports.updateGroceryQuantities = async (products) => {
  const pool = await poolPromise;
  const transaction = pool.transaction();

  try {
    await transaction.begin();

    for (const { product_name, quantity } of products) {
      await transaction.request()
        .input('product_name', product_name)
        .input('quantity_removed', quantity)
        .query(`
          UPDATE GroceryCatalog
          SET current_quantity = current_quantity - @quantity_removed
          WHERE product_name = @product_name
        `);
    }

    await transaction.commit();
    return { success: true };
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

exports.getProductsBelowMin = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
    SELECT product_name, current_quantity, min_quantity
    FROM GroceryCatalog
    WHERE current_quantity < min_quantity
  `);
  return result.recordset;
};
