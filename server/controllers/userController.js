import { db } from '../config/firebase.js';
import { upsertUser } from '../services/firestoreService.js';

/**
 * POST /api/auth/sync
 * Called from frontend immediately after Firebase login/register.
 * Syncs the Firebase Auth user into Firestore.
 */
export const syncUser = async (req, res) => {
  try {
    const { name, email, imageUrl } = req.body;
    const { uid } = req.user;

    const user = await upsertUser(uid, { name, email, imageUrl });
    return res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('syncUser error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to sync user' });
  }
};

/**
 * GET /api/auth/me
 * Returns the current authenticated user's Firestore profile.
 */
export const getMe = async (req, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, user: userDoc.data() });
  } catch (err) {
    console.error('getMe error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
