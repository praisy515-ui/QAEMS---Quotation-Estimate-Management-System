const dbHelper = require('../utils/dbHelper');

const createClient = async (req, res, next) => {
  try {
    const clients = await dbHelper.getCollection('clients');
    const cliNum = String(clients.length + 1).padStart(3, "0");
    const id = `CLI-${cliNum}`;
    
    const clientData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address || "",
      location: req.body.location || req.body.address || "",
      projectType: req.body.projectType || "Residential",
      status: req.body.status || "Lead",
      createdAt: new Date().toISOString()
    };

    const newClient = await dbHelper.insert('clients', id, clientData);
    
    // Log activity
    await dbHelper.logActivity(
      'Client Created',
      'Clients',
      newClient.id,
      req.user.uid,
      req.user.name
    );

    // Trigger System Notification
    await dbHelper.triggerNotification(
      'Client Registered',
      `Client profile for ${newClient.name} initialized in CRM.`
    );

    return res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: newClient
    });
  } catch (err) {
    return next(err);
  }
};

const getClients = async (req, res, next) => {
  try {
    const clients = await dbHelper.getCollection('clients');
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: clients
    });
  } catch (err) {
    return next(err);
  }
};

const getClientDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await dbHelper.getById('clients', id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: `Client with ID ${id} not found`,
        errors: [`Client profile not found`]
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: client
    });
  } catch (err) {
    return next(err);
  }
};

const updateClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await dbHelper.getById('clients', id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: `Client with ID ${id} not found`,
        errors: [`Client profile not found`]
      });
    }

    const updated = await dbHelper.update('clients', id, req.body);
    
    // Log activity
    await dbHelper.logActivity(
      'Client Updated',
      'Clients',
      id,
      req.user.uid,
      req.user.name
    );

    // Trigger Notification
    await dbHelper.triggerNotification(
      'Client Modified',
      `Updated profile details for client ${updated.name}.`
    );

    return res.status(200).json({
      success: true,
      message: 'Client updated successfully',
      data: updated
    });
  } catch (err) {
    return next(err);
  }
};

const deleteClient = async (req, res, next) => {
  const { id } = req.params;
  try {
    const client = await dbHelper.getById('clients', id);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: `Client with ID ${id} not found`,
        errors: [`Client profile not found`]
      });
    }

    await dbHelper.delete('clients', id);

    // Log activity
    await dbHelper.logActivity(
      'Client Deleted',
      'Clients',
      id,
      req.user.uid,
      req.user.name
    );

    // Trigger Notification
    await dbHelper.triggerNotification(
      'Client Profile Deleted',
      `Purged profile data for client ${client.name}.`
    );

    return res.status(200).json({
      success: true,
      message: 'Client deleted successfully',
      data: {}
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createClient,
  getClients,
  getClientDetails,
  updateClient,
  deleteClient
};
