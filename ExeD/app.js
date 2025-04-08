const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const supplierRoutes = require('./routes/supplierRoutes');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/supplier', supplierRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the homepage');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
