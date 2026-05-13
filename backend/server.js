const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ override: true });

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authRoutes = require('./routes/auth');
const auctionRoutes = require('./routes/auctions');

app.use('/api/auth', authRoutes);
app.use('/api/auctions', auctionRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Auction Backend API is running' });
});

const http = require('http');
const { Server } = require('socket.io');
const db = require('./config/db');

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a specific auction room
    socket.on('join_auction', async (auctionId) => {
        socket.join(`auction_${auctionId}`);
        console.log(`Socket ${socket.id} joined auction_${auctionId}`);
        
        // Send chat history to the newly connected user
        try {
            const [messages] = await db.execute(`
                SELECT c.*, u.name as user_name 
                FROM chat_messages c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.auction_id = ? 
                ORDER BY c.created_at ASC
            `, [auctionId]);
            socket.emit('chat_history', messages);
        } catch(error) {
            console.error('Error fetching chat history:', error);
        }
    });

    // Handle new chat messages
    socket.on('send_chat', async (data) => {
        const { auctionId, userId, message } = data;
        try {
            await db.execute(
                'INSERT INTO chat_messages (auction_id, user_id, message) VALUES (?, ?, ?)',
                [auctionId, userId, message]
            );
            
            // Get user name for broadcast
            const [users] = await db.execute('SELECT name FROM users WHERE id = ?', [userId]);
            const userName = users[0].name;

            const chatMessage = {
                auction_id: auctionId,
                user_id: userId,
                user_name: userName,
                message: message,
                created_at: new Date()
            };

            // Broadcast to everyone in the room
            io.to(`auction_${auctionId}`).emit('receive_chat', chatMessage);
        } catch(error) {
            console.error('Error saving chat message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Pass IO to routes or controllers if needed
app.set('io', io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
