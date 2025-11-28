import jwt from 'jsonwebtoken';

export function jwtAuthMiddleware(req, res, next) {
  // Check for token in Authorization header
  let token;
  const authorization = req.headers.authorization;
  if (authorization && authorization.startsWith('Bearer ')) {
    token = authorization.split(' ')[1];
  }

  // If not in header, check cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Token Not Found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Auth - Token verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export function tempTokenAuthMiddleware(req, res, next) {
  // Try to get token from Authorization header first
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.substring(7);
  } else {
    // Fallback to cookie
    token = req.cookies.temp_token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Temp token not found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ error: 'Invalid temp token' });
  }
}

// Function to generate JWT token
export function generateToken(userData) {
  return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '7d' }); // 7 days
}
