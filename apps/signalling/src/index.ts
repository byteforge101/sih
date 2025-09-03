// packages/signaling-server/src/index.ts
import { createServer } from 'http';
import { Server } from 'socket.io';

// Create a standard HTTP server
const httpServer = createServer();

// Wrap the HTTP server with a Socket.IO server
const io = new Server(httpServer, {
  // Configure CORS to allow our Next.js app to connect
  cors: {
    origin: "http://localhost:3001", // The URL of your Next.js app
    methods: ["GET", "POST"]
  }
});

const PORT = 8080;

console.log(`✅ Signaling server started on ws://localhost:${PORT}`);

// This function runs every time a new client connects to the server
io.on('connection', (socket) => {
  console.log(`📥 New client connected: ${socket.id}`);
  let currentRoom: string | null = null;

  // Listen for a client wanting to join a room
  socket.on('join-room', (roomId: string) => {
    currentRoom = roomId;
    socket.join(roomId); // Socket.IO's magic for joining a room
    console.log(`👤 Client ${socket.id} joined room: ${roomId}`);

    // Notify others in the room that a new user has joined
    // This is useful for initiating the call from the other side
    socket.to(roomId).emit('user-connected', socket.id);
  });

  // Listen for an "offer" and relay it to the correct user
  socket.on('offer', (data: { target: string; sdp: any }) => {
    console.log(`📩 Offer from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('offer', { from: socket.id, sdp: data.sdp });
  });
  
  // Listen for an "answer" and relay it
  socket.on('answer', (data: { target: string; sdp: any }) => {
    console.log(`📩 Answer from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('answer', { from: socket.id, sdp: data.sdp });
  });

  // Listen for "ice-candidate" and relay it
  socket.on('ice-candidate', (data: { target: string; candidate: any }) => {
    io.to(data.target).emit('ice-candidate', { from: socket.id, candidate: data.candidate });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    if (currentRoom) {
      // Notify others in the room that the user has left
      socket.to(currentRoom).emit('user-disconnected', socket.id);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
});

// Start the server
httpServer.listen(PORT);