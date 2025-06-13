import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';  

dotenv.config();

export const protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
      try {
        // Lấy token từ header
        token = authHeader.split(' ')[1];

        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Lấy thông tin user từ token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(401).json({ 
            message: 'Not authorized, user not found',
            error: 'USER_NOT_FOUND'
          });
        }

        // Gán user vào request
        req.user = user;
        next();
      } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
          message: 'Not authorized, token failed',
          error: error.name === 'JsonWebTokenError' ? 'INVALID_TOKEN' : 'TOKEN_EXPIRED'
        });
      }
    } else {
      return res.status(401).json({ 
        message: 'Not authorized, no token provided',
        error: 'NO_TOKEN'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: 'SERVER_ERROR'
    });
  }
};

// Middleware kiểm tra role admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as an admin',
      error: 'NOT_ADMIN'
    });
  }
}; 