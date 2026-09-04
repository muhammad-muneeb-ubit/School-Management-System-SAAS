import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate token and set cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true, // JavaScript cannot access this cookie
        secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in production
        sameSite: 'strict' // Prevents CSRF attacks
    };

    res.status(statusCode)
       .cookie('token', token, options)
       .json({
           _id: user._id,
           email: user.email,
           role: user.role,
           branchId: user.branchId
       });
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Logout user (clear cookie)
export const logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current logged in user (For frontend to verify session)
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        next(error);
    }
};