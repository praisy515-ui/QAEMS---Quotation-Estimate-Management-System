const { auth, firebaseEnabled } = require('../config/firebase');
const dbHelper = require('../utils/dbHelper');
const axios = require('axios');

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (firebaseEnabled && auth) {
      // In production Firebase, we sign in using the REST API since admin SDK doesn't do sign-in
      // We need a Firebase Web API Key for this, or we can configure it.
      // If no API Key is set, we verify if credentials match standard accounts or use local fallback logic
      const apiKey = process.env.FIREBASE_API_KEY;
      if (!apiKey) {
        // Fallback search in Firestore/users collection if no API key is provided
        const users = await dbHelper.getCollection('users');
        const matched = users.find(u => u.email === email);
        if (matched && password === 'admin123') { // simple password check
          return res.status(200).json({
            success: true,
            message: 'Success',
            data: {
              token: `mock-token-${matched.id}`,
              user: matched
            }
          });
        }
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password',
          errors: ['Unauthorized credentials']
        });
      }

      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
        { email, password, returnSecureToken: true }
      );

      const { localId, idToken } = response.data;
      const userRecord = await dbHelper.getById('users', localId);

      return res.status(200).json({
        success: true,
        message: 'Success',
        data: {
          token: idToken,
          user: userRecord || { id: localId, email, name: email.split('@')[0], role: 'Interior Designer' }
        }
      });
    } else {
      // Local Database Auth matching quotationService
      const users = await dbHelper.getCollection('users');
      // Support matching password 'admin123' or 'designer123'
      const matched = users.find(u => u.email === email);
      const isCorrectPassword = matched && (
        (matched.role === 'Admin' && password === 'admin123') ||
        (matched.role === 'Interior Designer' && password === 'designer123')
      );

      if (!isCorrectPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email address or password',
          errors: ['Unauthorized credentials']
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Success',
        data: {
          token: `mock-token-${matched.id.toLowerCase()}`,
          user: matched
        }
      });
    }
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid email address or password',
      errors: [err.message]
    });
  }
};

const register = async (req, res, next) => {
  const { email, password, name, role } = req.body;

  try {
    const roleValue = role || 'Interior Designer';
    const userPayload = {
      name,
      email,
      role: roleValue,
      createdAt: new Date().toISOString()
    };

    if (firebaseEnabled && auth) {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name
      });
      
      const newUser = await dbHelper.insert('users', userRecord.uid, userPayload);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser
      });
    } else {
      const users = await dbHelper.getCollection('users');
      const exists = users.find(u => u.email === email);
      if (exists) {
        return res.status(400).json({
          success: false,
          message: 'Email address already registered',
          errors: ['Duplicate user email']
        });
      }

      const generatedId = `UID-${Date.now()}`;
      const newUser = await dbHelper.insert('users', generatedId, userPayload);
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: newUser
      });
    }
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  login,
  register
};
