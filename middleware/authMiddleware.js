const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

console.log('🔍 JWT_SECRET being used at startup:', JWT_SECRET); // ✅ Log JWT_SECRET

function authenticateJWT(req, res, next) {
  console.log('🔹 authenticateJWT middleware was called'); // ✅ Confirms middleware execution

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('🔴 No valid Authorization header found');
    return res.status(401).json({ message: 'Unauthorized: No user logged in' });
  }

  const token = authHeader.split(' ')[1];

  console.log('🔍 Token received for verification:', token); // ✅ Logs token
  console.log('🔍 JWT_SECRET being used for verification:', JWT_SECRET); // ✅ Logs secret used

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    console.log('✅ JWT Verified Successfully:', decodedToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.log('🔴 JWT Verification Error:', err.message);
    return res.status(403).json({ message: 'Forbidden: Invalid token' });
  }
}

module.exports = authenticateJWT;
