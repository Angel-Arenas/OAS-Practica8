const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Configuración desde variables de entorno
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_NAME = process.env.DB_NAME || 'testdb';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASS = process.env.DB_PASS || 'password';
const APP_PORT = process.env.APP_PORT || 3000;

// Conexión a MongoDB
const MONGO_URI = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:27017/${DB_NAME}?authSource=admin`;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Schema simple
const ItemSchema = new mongoose.Schema({
  name: String,
  createdAt: { type: Date, default: Date.now }
});
const Item = mongoose.model('Item', ItemSchema);

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 API Backend funcionando correctamente',
    environment: {
      DB_HOST,
      DB_NAME,
      APP_PORT,
      DB_USER: DB_USER.substring(0, 2) + '***' // Ocultar credenciales
    },
    mongoStatus: mongoose.connection.readyState === 1 ? 'Conectado ✅' : 'Desconectado ❌',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  const health = {
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'UP' : 'DOWN',
    uptime: process.uptime()
  };
  res.json(health);
});

app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json({ count: items.length, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/items', async (req, res) => {
  try {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/env', (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    APP_PORT: process.env.APP_PORT,
    // NO mostrar DB_PASS en producción
    DB_PASS_SET: !!process.env.DB_PASS
  });
});

app.listen(APP_PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${APP_PORT}`);
  console.log(`📊 MongoDB URI: mongodb://${DB_USER}:***@${DB_HOST}:27017/${DB_NAME}`);
});
