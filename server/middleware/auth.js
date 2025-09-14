const authenticateUser = (req, res, next) => {
  const { username, password } = req.body;

  // Simple authentication check
  if (username === 'Bluewolf23' && password === 'Malik111') {
    req.isAuthenticated = true;
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid username or password' 
    });
  }
};

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. No token provided.' 
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  
  // Simple token validation (in production, use JWT or similar)
  if (token === 'bluewolf-auth-token-2024') {
    req.isAuthenticated = true;
    next();
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

module.exports = {
  authenticateUser,
  requireAuth
};
