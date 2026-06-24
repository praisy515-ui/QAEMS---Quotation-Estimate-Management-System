const dbHelper = require('../utils/dbHelper');

const getMonths = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const result = [];
  const d = new Date();
  // Return last 6 months
  for (let i = 5; i >= 0; i--) {
    const target = new Date(d.getFullYear(), d.getMonth() - i, 1);
    result.push({
      label: months[target.getMonth()],
      year: target.getFullYear(),
      monthIndex: target.getMonth(),
      key: `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`
    });
  }
  return result;
};

const getRevenueReport = async (req, res, next) => {
  try {
    const quotes = await dbHelper.getCollection('quotations');
    const months = getMonths();

    const data = months.map(m => {
      let residential = 0;
      let commercial = 0;
      let projects = 0;
      quotes.forEach(q => {
        if (q.status === 'Approved' && q.createdAt) {
          const qDate = new Date(q.createdAt);
          if (qDate.getFullYear() === m.year && qDate.getMonth() === m.monthIndex) {
            const amount = Number(q.total) || (q.costBreakdown?.grandTotal || 0);
            if (q.projectType === 'Commercial') {
              commercial += amount;
            } else {
              residential += amount;
            }
            projects++;
          }
        }
      });
      return {
        month: m.label,
        Residential: residential,
        Commercial: commercial,
        revenue: residential + commercial,
        projects
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data
    });
  } catch (err) {
    return next(err);
  }
};

const getClientReport = async (req, res, next) => {
  try {
    const clients = await dbHelper.getCollection('clients');
    const months = getMonths();

    const data = months.map(m => {
      let count = 0;
      clients.forEach(c => {
        if (c.createdAt) {
          const cDate = new Date(c.createdAt);
          if (cDate.getFullYear() === m.year && cDate.getMonth() === m.monthIndex) {
            count++;
          }
        }
      });
      return {
        month: m.label,
        clients: count
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data
    });
  } catch (err) {
    return next(err);
  }
};

const getQuotationReport = async (req, res, next) => {
  try {
    const quotes = await dbHelper.getCollection('quotations');
    const months = getMonths();

    const data = months.map(m => {
      let count = 0;
      quotes.forEach(q => {
        if (q.createdAt) {
          const qDate = new Date(q.createdAt);
          if (qDate.getFullYear() === m.year && qDate.getMonth() === m.monthIndex) {
            count++;
          }
        }
      });
      return {
        month: m.label,
        quotations: count
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data
    });
  } catch (err) {
    return next(err);
  }
};

const getApprovalReport = async (req, res, next) => {
  try {
    const quotes = await dbHelper.getCollection('quotations');
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let draft = 0;
    let underReview = 0;

    quotes.forEach(q => {
      if (q.status === 'Approved') approved++;
      else if (q.status === 'Pending') pending++;
      else if (q.status === 'Rejected') rejected++;
      else if (q.status === 'Draft') draft++;
      else if (q.status === 'Under Review') underReview++;
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data: [
        { name: 'Approved', value: approved, color: '#22C55E' },
        { name: 'Pending', value: pending + draft + underReview, color: '#F59E0B' },
        { name: 'Rejected', value: rejected, color: '#EF4444' }
      ]
    });
  } catch (err) {
    return next(err);
  }
};

const getSiteVisitReport = async (req, res, next) => {
  try {
    const visits = await dbHelper.getCollection('siteVisits');
    const months = getMonths();

    const data = months.map(m => {
      let count = 0;
      visits.forEach(v => {
        if (v.visitDate) {
          const vDate = new Date(v.visitDate);
          if (vDate.getFullYear() === m.year && vDate.getMonth() === m.monthIndex) {
            count++;
          }
        }
      });
      return {
        month: m.label,
        visits: count
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Success',
      data
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getRevenueReport,
  getClientReport,
  getQuotationReport,
  getApprovalReport,
  getSiteVisitReport
};
