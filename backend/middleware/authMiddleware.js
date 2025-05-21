import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      console.log('Looking for user ID:', decoded.userId);  
      
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        console.error('No user found for ID:', decoded.userId); 
        res.status(401);
        throw new Error('User not found');
      }
      
      console.log('User authenticated:', req.user._id); 
      next();
    } catch (error) {
      console.error('Auth Error:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user found');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('User role not authorized');
    }

    next();
  };
};
