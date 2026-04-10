import { db } from '../config/firebase.js';

/**
 * Requires the authenticated user to have isEducator: true in Firestore.
 * Must be used AFTER the protect middleware.
 */
const requireEducator = async (req, res, next) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists || !userDoc.data().isEducator) {
      return res.status(403).json({ success: false, message: 'Educator access required' });
    }

    next();
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default requireEducator;
