// middleware/dragonValidation.js
export const validateDragonMerge = (req, res, next) => {
    const { dragonId1, dragonId2 } = req.body;
    
    if (!dragonId1 || !dragonId2) {
      return res.status(400).json({ 
        message: 'Both dragon IDs are required for merging' 
      });
    }
    
    if (dragonId1 === dragonId2) {
      return res.status(400).json({ 
        message: 'Cannot merge dragon with itself' 
      });
    }
    
    next();
  };
  
  export const validateDragonSync = (req, res, next) => {
    const { dragons } = req.body;
    
    if (!Array.isArray(dragons)) {
      return res.status(400).json({ 
        message: 'Dragons data must be an array' 
      });
    }
    
    // Validate each dragon object
    for (const dragon of dragons) {
      if (!dragon.level || !dragon.count) {
        return res.status(400).json({ 
          message: 'Each dragon must have level and count' 
        });
      }
      
      if (dragon.level < 1 || dragon.level > 5) {
        return res.status(400).json({ 
          message: 'Dragon level must be between 1 and 5' 
        });
      }
      
      if (dragon.count < 1) {
        return res.status(400).json({ 
          message: 'Dragon count must be at least 1' 
        });
      }
    }
    
    next();
  };
  
  // middleware/errorHandler.js
  export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Log error
    console.error('Dragon API Error:', err);
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = 'Dragon not found';
      error = { message, statusCode: 404 };
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = { message, statusCode: 400 };
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message);
      error = { message, statusCode: 400 };
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error'
    });
  };