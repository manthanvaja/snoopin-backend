import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', authRoutes);

// Default Route
app.get('/', (req, res) => {
    res.send('🟢 Snoopin Backend API is Running');
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`🚀 Server started on port ${PORT}`);
    try {
        await pool.connect();
    } catch (err) {
        console.error('❌ Database connection failed:', err);
    }
});
