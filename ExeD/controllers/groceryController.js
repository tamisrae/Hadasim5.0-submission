const groceryModel = require('../models/groceryModel');
const productModel = require('../models/productModel');
const ordersModel = require('../models/ordersModel');

exports.updateGroceryStock = async (req, res) => {
    const products = req.body.products;
  
    if (!Array.isArray(products)) {
      return res.status(400).send('Invalid input format');
    }
  
    try {
        await groceryModel.updateGroceryQuantities(products);
  
        const lowStockItems = await groceryModel.getProductsBelowMin();

        const supplierOrders = {}; 

        for (const item of lowStockItems) {
            const quantityNeeded = item.min_quantity - item.current_quantity;

            const suppliers = await productModel.getSuppliersForProduct(item.product_name);

            if (!suppliers || suppliers.length === 0) continue;

            suppliers.sort((a, b) => a.unit_price - b.unit_price);

            const cheapest = suppliers[0];

            const {
                supplier_id,
                id,
                unit_price,
                min_quantity: supplierMinQuantity
            } = cheapest;

            const orderQuantity = Math.max(quantityNeeded, supplierMinQuantity);

            if (!supplierOrders[supplier_id]) {
                 supplierOrders[supplier_id] = [];
            }

            supplierOrders[supplier_id].push({
                id,
                quantity: orderQuantity,
                unit_price
            });
        }

        for (const [supplierId, items] of Object.entries(supplierOrders)) {
        const orderId = await ordersModel.createOrder(parseInt(supplierId));
        for (const item of items) {
            await ordersModel.insertOrderItem(orderId, item);
        }
        }

        res.status(200).send('Stock updated and automatic orders placed successfully');

    } catch (error) {
        console.error('Error in updateStoreStock:', error);
        res.status(500).send('Internal server error');
    }
};
  
