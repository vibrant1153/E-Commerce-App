const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/productRoutes');

app.use('/api/products', productRoutes);
app.use(('/api/products'), require('./routes/installer.route'))
app.use('/api/users', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(5000, () => console.log('Server running on port 5000'));




