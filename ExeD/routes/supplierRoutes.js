const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const orderController = require('../controllers/orderController');
const groceryController = require('../controllers/groceryController');

router.get('/login', supplierController.getLoginPage);
router.post('/login', supplierController.loginSupplier);

router.get('/register', supplierController.getRegisterPage);
router.post('/register', supplierController.registerSupplier);

router.get('/orders', orderController.getAllSupplierOrders);
router.get('/orders/:id', orderController.getOrderDetails);

router.post('/order/updateStatus/:id', orderController.updateOrderStatus);
router.post('/grocer/order/confirm/:id', orderController.updateOrderStatus);

router.get('/grocer/login', supplierController.getGrocerLoginPage);
router.post('/grocer/login', supplierController.loginGrocer);

router.get('/grocer/allOrders', orderController.getAllOrders);

router.get('/grocer/allSuppliers', supplierController.getAllSuppliers);

router.get('/orders/details/:id', supplierController.getSupplierDetails);
router.post('/orders/create/:id', orderController.createOrder);

router.post('/grocer/updateStock', groceryController.updateGroceryStock);
module.exports = router;
