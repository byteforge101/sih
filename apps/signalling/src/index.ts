import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

const clientURL = process.env.CLIENT_URL || "http://localhost:3001";

const io = new Server(httpServer, {
  cors: {
    origin: clientURL,
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
    console.log(`✅ Signaling server started on port ${PORT}`);
    console.log(`📡 Allowing connections from: ${clientURL}`);
});

io.on('connection', (socket) => {
  console.log(`📥 New client connected: ${socket.id}`);
  let currentRoom: string | null = null;
  
  socket.on('join-room', (roomId: string) => {
    currentRoom = roomId;
    socket.join(roomId); 
    console.log(`👤 Client ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('offer', (data: { target: string; sdp: any }) => {
    console.log(`📩 Offer from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('offer', { from: socket.id, sdp: data.sdp });
  });
  
  socket.on('answer', (data: { target: string; sdp: any }) => {
    console.log(`📩 Answer from ${socket.id} to ${data.target}`);
    io.to(data.target).emit('answer', { from: socket.id, sdp: data.sdp });
  });

  socket.on('ice-candidate', (data: { target: string; candidate: any }) => {
    io.to(data.target).emit('ice-candidate', { from: socket.id, candidate: data.candidate });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    if (currentRoom) {
      socket.to(currentRoom).emit('user-disconnected', socket.id);
    }
  });

  socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
});