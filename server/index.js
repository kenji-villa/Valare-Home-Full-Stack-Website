const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./db/connect');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const cartRoutes = require('./routes/cart');  

const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const compression = require('compression');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Define allowed origins
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173", // Vite default
  process.env.CLIENT_URL,  // Your Vercel URL from Render Env Vars
];

//CORS must be configured BEFORE routes
const corsOptions = {
  origin: true, // Allows all origins dynamically
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
 allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Pragma"],
};


app.use(cors(corsOptions));

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Allow everything
    methods: ["GET", "POST"],
    credentials: true,
  },
});


//Prevent server crashes
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  console.error('Stack:', err.stack);
  // Don't exit - keep the server running
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION at:', promise);
  console.error('Reason:', reason);
  // Don't exit - keep the server running
});

app.use(compression()); 
app.use(cors(corsOptions));

// Handle preflight requests explicitly (safety net)
app.options('*', cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// API Routes - make sure cart is registered
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);  // 



app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('join-admin-room', () => {
    socket.join('admin-room');
    console.log('👑 Admin joined the admin room');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
const startServer = async () => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.IO ready for connections`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = { app, io, server };