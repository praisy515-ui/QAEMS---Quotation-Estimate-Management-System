const dbHelper = require('../utils/dbHelper');
const calculator = require('../services/quotationCalculatorService');

const calculateQuotation = async (req, res, next) => {
  try {
    const result = calculator.calculate(req.body);
    return res.status(200).json({
      success: true,
      message: 'Calculation completed',
      data: result
    });
  } catch (err) {
    return next(err);
  }
};

const createQuotation = async (req, res, next) => {
  try {
    const quotes = await dbHelper.getCollection('quotations');
    const year = new Date().getFullYear();
    const nextNum = String(quotes.length + 1).padStart(3, "0");
    const id = `Q-${year}-${nextNum}`;

    // Perform calculation
    const breakdown = calculator.calculate(req.body);

    const statusValue = req.body.status || "Draft";
    const statusHistory = [
      { status: statusValue, timestamp: new Date().toISOString() }
    ];

    const quotationData = {
      clientId: req.body.clientId || "",
      clientName: req.body.clientName || "Unknown Client",
      phone: req.body.phone || "",
      email: req.body.email || "",
      address: req.body.address || "",
      projectType: req.body.projectType || "Residential",
      projectLocation: req.body.projectLocation || req.body.location || "",
      roomType: req.body.roomType,
      area: Number(req.body.area),
      numRooms: Number(req.body.numRooms) || 1,
      scopeOfWork: req.body.scopeOfWork || "",
      materialLevel: req.body.materialLevel || req.body.materialQuality || "Standard",
      materialQuality: req.body.materialLevel || req.body.materialQuality || "Standard",
      furnitureItems: req.body.furnitureItems || [],
      furnitureOptions: req.body.furnitureOptions || {},
      lightingType: req.body.lightingType || "Basic",
      labourCost: Number(req.body.labourCost) || 0,
      tax: Number(req.body.tax) !== undefined ? Number(req.body.tax) : (Number(req.body.taxPercentage) || 0),
      discount: Number(req.body.discount) !== undefined ? Number(req.body.discount) : (Number(req.body.discountPercentage) || 0),
      taxPercentage: Number(req.body.taxPercentage) !== undefined ? Number(req.body.taxPercentage) : (Number(req.body.tax) || 0),
      discountPercentage: Number(req.body.discountPercentage) !== undefined ? Number(req.body.discountPercentage) : (Number(req.body.discount) || 0),
      installationCharges: Number(req.body.installationCharges) || 0,
      otherCharges: Number(req.body.otherCharges) || 0,
      subtotal: breakdown.subtotal,
      total: breakdown.grandTotal,
      costBreakdown: breakdown,
      status: statusValue,
      statusHistory,
      notes: req.body.notes || "",
      createdAt: new Date().toISOString()
    };

    const newQuote = await dbHelper.insert('quotations', id, quotationData);

    // Log Activity
    await dbHelper.logActivity(
      'Quotation Created',
      'Quotations',
      newQuote.id,
      req.user.uid,
      req.user.name
    );

    // Trigger Notification
    await dbHelper.triggerNotification(
      'New Quotation Generated',
      `Quotation ${newQuote.id} has been created for client ${newQuote.clientName}.`
    );

    // Sync CRM stage if client exists
    if (req.body.clientId) {
      await dbHelper.update('clients', req.body.clientId, { status: 'Proposal' });
    }

    return res.status(201).json({
      success: true,
      message: 'Quotation created successfully',
      data: newQuote
    });
  } catch (err) {
    return next(err);
  }
};

const getQuotations = async (req, res, next) => {
  try {
    const quotes = await dbHelper.getCollection('quotations');
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: quotes
    });
  } catch (err) {
    return next(err);
  }
};

const getQuotationDetails = async (req, res, next) => {
  const { id } = req.params;
  try {
    const quote = await dbHelper.getById('quotations', id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: `Quotation with ID ${id} not found`,
        errors: [`Quotation file not found`]
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: quote
    });
  } catch (err) {
    return next(err);
  }
};

const updateQuotation = async (req, res, next) => {
  const { id } = req.params;
  try {
    const quote = await dbHelper.getById('quotations', id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: `Quotation with ID ${id} not found`,
        errors: [`Quotation not found`]
      });
    }

    // Recalculate cost
    const mergedData = { ...quote, ...req.body };
    const breakdown = calculator.calculate(mergedData);

    const updateFields = {
      ...req.body,
      subtotal: breakdown.subtotal,
      total: breakdown.grandTotal,
      costBreakdown: breakdown
    };

    // If status is changing, track history
    if (req.body.status && req.body.status !== quote.status) {
      const history = [...(quote.statusHistory || [])];
      history.push({ status: req.body.status, timestamp: new Date().toISOString() });
      updateFields.statusHistory = history;

      // Log specific status transitions
      if (req.body.status === 'Approved') {
        await dbHelper.logActivity('Quotation Approved', 'Quotations', id, req.user.uid, req.user.name);
      } else if (req.body.status === 'Rejected') {
        await dbHelper.logActivity('Quotation Rejected', 'Quotations', id, req.user.uid, req.user.name);
      } else {
        await dbHelper.logActivity(`Quotation Status Updated: ${req.body.status}`, 'Quotations', id, req.user.uid, req.user.name);
      }
    } else {
      await dbHelper.logActivity('Quotation Updated', 'Quotations', id, req.user.uid, req.user.name);
    }

    const updated = await dbHelper.update('quotations', id, updateFields);

    // Sync CRM stage to Signed if approved
    if (req.body.status === 'Approved' && updated.clientId) {
      await dbHelper.update('clients', updated.clientId, { status: 'Signed' });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation updated successfully',
      data: updated
    });
  } catch (err) {
    return next(err);
  }
};

const updateQuotationStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({
      success: false,
      message: 'Missing required status field',
      errors: ['status is required']
    });
  }

  try {
    const quote = await dbHelper.getById('quotations', id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: `Quotation with ID ${id} not found`,
        errors: [`Quotation not found`]
      });
    }

    const history = [...(quote.statusHistory || [])];
    history.push({ status, timestamp: new Date().toISOString() });

    const updateFields = {
      status,
      statusHistory: history
    };

    if (status === 'Approved') {
      await dbHelper.logActivity('Quotation Approved', 'Quotations', id, req.user.uid, req.user.name);
    } else if (status === 'Rejected') {
      await dbHelper.logActivity('Quotation Rejected', 'Quotations', id, req.user.uid, req.user.name);
    } else {
      await dbHelper.logActivity(`Quotation Status Updated: ${status}`, 'Quotations', id, req.user.uid, req.user.name);
    }

    const updated = await dbHelper.update('quotations', id, updateFields);

    // Trigger Notification
    await dbHelper.triggerNotification(
      `Quotation ${status}`,
      `Quotation ${id} for client ${updated.clientName} status shifted to ${status}.`
    );

    // Sync CRM client timeline if client exists
    if (status === 'Approved' && updated.clientId) {
      await dbHelper.update('clients', updated.clientId, { status: 'Signed' });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation status updated successfully',
      data: updated
    });
  } catch (err) {
    return next(err);
  }
};

const deleteQuotation = async (req, res, next) => {
  const { id } = req.params;
  try {
    const quote = await dbHelper.getById('quotations', id);
    if (!quote) {
      return res.status(404).json({
        success: false,
        message: `Quotation with ID ${id} not found`,
        errors: [`Quotation not found`]
      });
    }

    await dbHelper.delete('quotations', id);

    // Log Activity
    await dbHelper.logActivity(
      'Quotation Deleted',
      'Quotations',
      id,
      req.user.uid,
      req.user.name
    );

    return res.status(200).json({
      success: true,
      message: 'Quotation deleted successfully',
      data: {}
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  calculateQuotation,
  createQuotation,
  getQuotations,
  getQuotationDetails,
  updateQuotation,
  updateQuotationStatus,
  deleteQuotation
};
