import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import { errHandler, notFound } from './middleware/errorHandler.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { Server } from "socket.io";
import { createServer } from 'http';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


connectDB();
app.use(cors({
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', '*'],
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

app.use('/api/events', (req, res, next) => {
  req.io = io;
  next();
}, eventRoutes);

app.get('', (req, res) => {
  res.send('Server is up...')
});

app.use(notFound);
app.use(errHandler);

// Socket.IO connection
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));