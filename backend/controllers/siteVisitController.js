const dbHelper = require('../utils/dbHelper');

const createVisit = async (req, res, next) => {
  try {
    const visits = await dbHelper.getCollection('siteVisits');
    const visNum = String(visits.length + 1).padStart(3, "0");
    const id = `SV-${visNum}`;

    // Get client details if clientId is passed to retrieve clientName
    let clientName = req.body.clientName || '';
    if (req.body.clientId && !clientName) {
      const client = await dbHelper.getById('clients', req.body.clientId);
      if (client) {
        clientName = client.name;
      }
    }

    const visitData = {
      clientId: req.body.clientId,
      clientName: clientName || req.body.clientName || "Unknown Client",
      visitDate: req.body.visitDate,
      time: req.body.time || "10:00 AM",
      address: req.body.address,
      location: req.body.location || req.body.address,
      assignedDesigner: req.body.assignedDesigner || req.body.designer || " Sarah Jenkins",
      designer: req.body.designer || req.body.assignedDesigner || " Sarah Jenkins",
      notes: req.body.notes || "",
      status: req.body.status || "Scheduled",
      createdAt: new Date().toISOString()
    };

    const newVisit = await dbHelper.insert('siteVisits', id, visitData);

    // Log Activity
    await dbHelper.logActivity(
      'Site Visit Scheduled',
      'SiteVisits',
      newVisit.id,
      req.user.uid,
      req.user.name
    );

    // Trigger System Notification
    await dbHelper.triggerNotification(
      'Site Visit Booked',
      `A new site visit has been scheduled for ${newVisit.clientName} on ${newVisit.visitDate} with designer ${newVisit.assignedDesigner}.`
    );

    // If client exists, optionally append timeline log in localDB/Firestore
    if (req.body.clientId) {
      const client = await dbHelper.getById('clients', req.body.clientId);
      if (client) {
        // Change client stage to Audit
        await dbHelper.update('clients', req.body.clientId, { status: "Audit" });
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Site visit created successfully',
      data: newVisit
    });
  } catch (err) {
    return next(err);
  }
};

const getVisits = async (req, res, next) => {
  try {
    const visits = await dbHelper.getCollection('siteVisits');
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: visits
    });
  } catch (err) {
    return next(err);
  }
};

const getVisitDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const visit = await dbHelper.getById('siteVisits', id);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: `Site visit with ID ${id} not found`,
        errors: [`Site visit not found`]
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: visit
    });
  } catch (err) {
    return next(err);
  }
};

const updateVisit = async (req, res, next) => {
  const { id } = req.params;
  try {
    const visit = await dbHelper.getById('siteVisits', id);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: `Site visit with ID ${id} not found`,
        errors: [`Site visit not found`]
      });
    }

    const updated = await dbHelper.update('siteVisits', id, req.body);

    // Log Activity
    await dbHelper.logActivity(
      'Site Visit Updated',
      'SiteVisits',
      id,
      req.user.uid,
      req.user.name
    );

    // If status changed to Completed, update client status
    if (req.body.status === 'Completed' && visit.clientId) {
      await dbHelper.update('clients', visit.clientId, { status: 'Audit' });
    }

    return res.status(200).json({
      success: true,
      message: 'Site visit updated successfully',
      data: updated
    });
  } catch (err) {
    return next(err);
  }
};

const deleteVisit = async (req, res, next) => {
  const { id } = req.params;
  try {
    const visit = await dbHelper.getById('siteVisits', id);
    if (!visit) {
      return res.status(404).json({
        success: false,
        message: `Site visit with ID ${id} not found`,
        errors: [`Site visit not found`]
      });
    }

    await dbHelper.delete('siteVisits', id);

    // Log Activity
    await dbHelper.logActivity(
      'Site Visit Deleted',
      'SiteVisits',
      id,
      req.user.uid,
      req.user.name
    );

    return res.status(200).json({
      success: true,
      message: 'Site visit deleted successfully',
      data: {}
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createVisit,
  getVisits,
  getVisitDetails,
  updateVisit,
  deleteVisit
};
