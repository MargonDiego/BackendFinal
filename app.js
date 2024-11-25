require('reflect-metadata');
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/database');
const routes = require('./routes');
const { verifyToken } = require('./config/jwt');
const AuthMiddleware = express.Router();
const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de autenticación para rutas protegidas
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  const user = verifyToken(token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  req.user = user;
  next();
}

// Rutas públicas y protegidas
app.use('/api', routes);
app.use('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});

// Inicialización de la base de datos y servidor
async function startServer() {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
