const { db, firebaseEnabled } = require('../config/firebase');
const localDb = require('../models/localDb');

const dbHelper = {
  getCollection: async (collectionName) => {
    if (firebaseEnabled && db) {
      const snapshot = await db.collection(collectionName).get();
      const docs = [];
      snapshot.forEach(doc => {
        docs.push({ id: doc.id, ...doc.data() });
      });
      return docs;
    }
    return localDb.getCollection(collectionName);
  },

  getById: async (collectionName, id) => {
    if (firebaseEnabled && db) {
      const doc = await db.collection(collectionName).doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    }
    return localDb.getById(collectionName, id);
  },

  insert: async (collectionName, id, data) => {
    const finalId = id || `id-${Date.now()}`;
    const dataWithId = { id: finalId, ...data };
    
    if (firebaseEnabled && db) {
      await db.collection(collectionName).doc(finalId).set(dataWithId);
      return dataWithId;
    }
    return localDb.insert(collectionName, dataWithId);
  },

  update: async (collectionName, id, data) => {
    if (firebaseEnabled && db) {
      await db.collection(collectionName).doc(id).update(data);
      const updated = await db.collection(collectionName).doc(id).get();
      return { id: updated.id, ...updated.data() };
    }
    return localDb.update(collectionName, id, data);
  },

  delete: async (collectionName, id) => {
    if (firebaseEnabled && db) {
      await db.collection(collectionName).doc(id).delete();
      return true;
    }
    return localDb.delete(collectionName, id);
  },

  logActivity: async (action, entityType, entityId, userId, userName) => {
    const activity = {
      action,
      entityType,
      entityId,
      userId: userId || 'SYSTEM',
      userName: userName || 'System Process',
      user: userName || 'System Process',
      timestamp: new Date().toISOString()
    };
    const actId = `ACT-${Date.now()}`;
    await dbHelper.insert('activities', actId, activity);
  },

  triggerNotification: async (title, message) => {
    const notification = {
      title,
      message,
      status: 'Unread',
      createdAt: new Date().toISOString()
    };
    const notifId = `NTF-${Date.now()}`;
    await dbHelper.insert('notifications', notifId, notification);
  }
};

module.exports = dbHelper;
