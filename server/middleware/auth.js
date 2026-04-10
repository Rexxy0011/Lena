import { auth } from '../config/firebase.js';

/**
 * Verifies the Firebase ID token from the Authorization header.
 * Sets req.user = { uid, email, name, picture, ... } on success.
 */
const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  const idToken = header.split('Bearer ')[1];

  try {
    const decoded = await auth.verifyIdToken(idToken);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default protect;
