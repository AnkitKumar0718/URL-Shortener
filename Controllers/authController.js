const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const loginCallback = (req, res) => {
    const token = jwt.sign({ id: req.user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
};

const protectedRoute = (req, res) => {
    res.json({ message: `Welcome, user ${req.user.id}!`, user: req.user });
};

const logOutUser= (req, res) => {
  res.clearCookie('authToken');  
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { loginCallback, protectedRoute,logOutUser};