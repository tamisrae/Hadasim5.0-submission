const productModel = require('../models/productModel');
const ordersModel = require('../models/ordersModel');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await ordersModel.getAllOrders(); 
    res.render('allOrders', { orders: orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).send('Error fetching orders');
  }
};

exports.getOrderDetails = async (req, res) => {
  const orderId = req.params.id;

  try {
    const orderDetails = await ordersModel.getOrderWithProducts(orderId);
    const orderStatus = await ordersModel.getOrderDetails(orderId);

    if (!orderDetails || orderDetails.length === 0) {
      return res.status(404).send('Order not found');
    }

    res.render('orderDetails', {
      orderDetails,
      orderStatus,
      currentUser: req.session.userDetails 
    });
  } catch (err) {
    res.status(500).send('Error fetching order details');
  }
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const {supplierId, isSupplier} = req.session.userDetails;

  try {
    if(isSupplier){
        const orderItems = await ordersModel.getOrderWithProducts(orderId);

    for (const item of orderItems) {
      const products = await productModel.getProductBySupplierId(supplierId, item.product_id);
    }

    const rowsAffected = await ordersModel.updateOrderStatus(orderId, 2);

    if (rowsAffected > 0) {
      return res.status(200).send({ message: 'Order status updated successfully' });
    } else {
      throw new Error('Order not found or status update failed');
    }
    }
  
    const rowsAffected = await ordersModel.updateOrderStatus(orderId, 3);
    if (rowsAffected > 0) {
      res.status(200).send({ message: 'Order status updated successfully' });
    } else {
      throw new Error('Order not found or status update failed');
    }

  } catch (err) {
    res.status(500).send({ message: 'Error updating order status' });
  }
};

exports.createOrder = async (req, res) => {
    const { products } = req.body;
  
    try {
      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).send('No valid products or quantities selected');
      }
  
      const validProducts = [];
  
      for (let i = 0; i < products.length; i++) {
        const { productId, quantity } = products[i];
  
        if (!productId || !quantity || quantity <= 0) {
          return res.status(400).send(`Invalid quantity for product at index ${i}`);
        }
  
        const product = await productModel.getProductById(productId);
        if (!product) {
          return res.status(404).send(`Product with ID ${productId} not found`);
        }
  
        const minQuantity = product.min_quantity;
        if (quantity < minQuantity) {
          return res.status(400).send(`Minimum quantity for "${product.product_name}" is ${minQuantity}`);
        }
  
        validProducts.push({
          productId,
          quantity,
          unitPrice: product.unit_price
        });
      }
  
      const order = await ordersModel.createOrder(req.params.id);
  
      for (const item of validProducts) {
        await ordersModel.addItemToOrder(order.id, item.productId, item.quantity, item.unitPrice);
      }
  
      res.status(200).json({});
    } catch (err) {
      console.error('Error processing order:', err);
      res.status(500).send('Error creating order');
    }
  };
  
exports.getAllSupplierOrders = async (req, res) => {
    const supplierId = req.session.userDetails.supplierId; 
  
    try {
      const orders = await ordersModel.getSupplierOrders(supplierId); 
      res.render('orders', { orders: orders });
    } catch (err) {
      console.error('Error fetching orders:', err);
      res.status(500).send('Error fetching orders');
    }
  };