import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import connectDB from'./config/db.js';
import User from './models/User.js';
import Branch from './models/Branch.js';
import Setting from './models/Setting.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import examRoutes from './routes/examRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import communicationRoutes from './routes/communicationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import logRoutes from './routes/logRoutes.js';
import archiveRoutes from './routes/archiveRoutes.js';
import pdfRoutes from './routes/pdfRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { sanitizeData } from './middleware/sanitizeMiddleware.js';  


dotenv.config();

// Connect DB & Auto-create Super Admin (your existing code)
connectDB().then(async () => { 
    // Check if Super Admin exists, if not, create one automatically
    const adminExists = await User.findOne({ role: 'Super Admin' });
    if (!adminExists) {
        await User.create({
            email: 'superadmin@sms.com',
            password: 'Admin123!', // Change this in production!
            role: 'Super Admin',
            profile: { firstName: 'Super', lastName: 'Admin' }
        });
        await Setting.create({ maxBranches: 3 });
        console.log('✅ Super Admin & Default Settings Created');
    }
 });

const app = express();

// 1. Security Middleware
app.use(helmet()); // Secures HTTP headers
app.use(sanitizeData); // Prevents NoSQL injection (removes $ and . from req.body)

// 2. Cookie Parser (Replaces JSON body parsing for auth)
app.use(cookieParser());
app.use(express.json());

// 3. CORS Config (Allows cookies from frontend)
app.use(cors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    credentials: true // CRITICAL: Allows the browser to send/receive HttpOnly cookies
}));

// 4. Rate Limiter (Prevents Brute Force Attacks on Login)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.'
});
// app.use(limiter);

// Routes
app.use('/api/health', (req, res) => res.status(200).json({ status: 'OK', timestamp: new Date() }));
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/promotion', promotionRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/communication', communicationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));