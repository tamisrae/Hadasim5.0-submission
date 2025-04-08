const supplierModel = require('../models/supplierModel');
const productModel = require('../models/productModel');
const registerModel = require('../models/registerModel');

exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.loginSupplier = async (req, res) => {
  const { username, password } = req.body;

  try {
    const supplier = await supplierModel.getSupplierByUsername(username);

    if (supplier && supplier.password === password) {
      req.session.userDetails  = {
        userId: supplier.user_id,
        supplierId: supplier.supplier_id,
        isSupplier: true
      };
      res.redirect('/supplier/orders');
    } else {
      res.render('login', { error: 'Incorrect username or password' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server Error');
  }
};

exports.getRegisterPage = (req, res) => {
  res.render('register');
};

exports.registerSupplier = async (req, res) => {
  const { username, password, company_name, phone_number, representative_name, product_name, price_per_unit, min_quantity } = req.body;

  const existing = await registerModel.getSupplierByUsername(username);
  if (existing) return res.send('Username already exists');

  try {
    const { supplier_id } = await registerModel.insertSupplier({
      username, password, company_name, phone_number, representative_name
    });

    const insertProductPromises = product_name.map((name, index) => {
      return productModel.insertProduct({
        supplierId: supplier_id,
        productName: name,
        pricePerUnit: price_per_unit[index],
        minQuantity: min_quantity[index]
      });
    });

    await Promise.all(insertProductPromises);

    res.redirect('/supplier/login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Server error during registration');
  }
};

exports.getGrocerLoginPage = (req, res) => {
  res.render('grocerLogin');  
};

exports.loginGrocer = async (req, res) => {
  const { username, password } = req.body;

  try {
    const grocer = await supplierModel.getSupplierByUsername(username);

    if(grocer.supplier_id){
      throw new Error ({message: 'You are not the grocer'})
    }

    if (grocer && grocer.password === password && !grocer.is_supplier) {
      req.session.userDetails = {
        userId: grocer.user_id,
        isSupplier: false
      };
      res.redirect('/supplier/grocer/allOrders');  
    } else {
      res.render('grocerLogin', { error: 'Incorrect username, password, or you are not a Grocer' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server Error');
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await supplierModel.getAllSuppliers();
    res.render('allSuppliers', { suppliers });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getSupplierDetails = async (req, res) => {
  const supplierId = req.params.id;

  try {
    const supplier = await supplierModel.getSupplierById(supplierId);
    const products = await productModel.getProductBySupplierId(supplierId);

    if (!supplier) {
      return res.status(404).send('Supplier not found');
    }

    res.render('supplierDetails', { supplier, products });
  } catch (err) {
    console.error('Error fetching supplier details:', err);
    res.status(500).send('Server error fetching supplier details');
  }
};


