const dbHelper = require('../utils/dbHelper');

const getSummary = async (req, res, next) => {
  try {
    const clients = await dbHelper.getCollection('clients');
    const quotations = await dbHelper.getCollection('quotations');
    const siteVisits = await dbHelper.getCollection('siteVisits');

    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let revenue = 0;

    quotations.forEach(q => {
      if (q.status === 'Approved') {
        approved++;
        revenue += (q.total || q.costBreakdown?.grandTotal || 0);
      } else if (['Pending', 'Under Review', 'Draft'].includes(q.status)) {
        pending++;
      } else if (q.status === 'Rejected') {
        rejected++;
      }
    });

    // Site visits this month
    const currentMonthPrefix = new Date().toISOString().substring(0, 7); // e.g. "2026-06"
    const visitsThisMonth = siteVisits.filter(v => v.visitDate && v.visitDate.startsWith(currentMonthPrefix)).length;

    // Conversion rate
    const totalQuotes = quotations.length;
    const conversionRate = totalQuotes > 0 ? Math.round((approved / totalQuotes) * 100) : 0;

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: {
        totalClients: clients.length,
        totalQuotations: totalQuotes,
        approvedQuotations: approved,
        pendingQuotations: pending,
        rejectedQuotations: rejected,
        siteVisitsThisMonth: visitsThisMonth,
        conversionRate,
        revenueGenerated: revenue
      }
    });
  } catch (err) {
    return next(err);
  }
};

const getRecentActivities = async (req, res, next) => {
  try {
    // We map notification feed or activities as recent activities
    const activities = await dbHelper.getCollection('activities');
    const sorted = [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
      
    return res.status(200).json({
      success: true,
      message: 'Success',
      data: sorted
    });
  } catch (err) {
    return next(err);
  }
};

const getUpcomingVisits = async (req, res, next) => {
  try {
    const visits = await dbHelper.getCollection('siteVisits');
    const upcoming = visits
      .filter(v => v.status === 'Scheduled')
      .sort((a, b) => new Date(a.visitDate) - new Date(b.visitDate))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: upcoming
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getSummary,
  getRecentActivities,
  getUpcomingVisits
};
