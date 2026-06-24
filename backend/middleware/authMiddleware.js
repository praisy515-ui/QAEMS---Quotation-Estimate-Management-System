const { auth, firebaseEnabled, db } = require('../config/firebase');
const localDb = require('../models/localDb');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Missing or invalid authorization header',
      errors: ['No token provided']
    });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    if (firebaseEnabled && auth) {
      // Production Firebase verification
      const decodedToken = await auth.verifyIdToken(token);
      let userRole = 'Interior Designer'; // default fallback
      
      // Get role from Firestore
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      if (userDoc.exists) {
        userRole = userDoc.data().role;
      }
      
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.email.split('@')[0],
        role: userRole
      };
      return next();
    } else {
      // Local fallback mode verification
      let mockUid = 'UID-ADMIN';
      if (token.includes('designer')) {
        mockUid = 'UID-DESIGNER';
      }
      
      const mockUser = localDb.getById('users', mockUid);
      if (!mockUser) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Mock user not found',
          errors: []
        });
      }
      
      req.user = {
        uid: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role
      };
      return next();
    }
  } catch (err) {
    console.error('Authentication verification failed:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token session',
      errors: [err.message]
    });
  }
};

module.exports = authMiddleware;
