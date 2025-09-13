const login = (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate credentials
    if (username === 'Bluewolf23' && password === 'Malik111') {
      // In a real app, you'd generate a JWT token here
      const token = 'bluewolf-auth-token-2024';
      
      res.json({
        success: true,
        message: 'Login successful',
        token: token,
        user: {
          username: username,
          company: 'BlueWolf Security'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

const verifyToken = (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid',
    user: {
      username: 'Bluewolf23',
      company: 'BlueWolf Security'
    }
  });
};

module.exports = {
  login,
  logout,
  verifyToken
};
