const jwt = require('jsonwebtoken');
const user = require('../models/User');

const protect = async (req, res, next) => {
    try {
        // check for token in header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // verify token
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        next();
    }catch (err) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};