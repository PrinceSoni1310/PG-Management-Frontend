// PG Management Utilities

export const validatePGData = (pgData) => {
  const errors = {};

  if (!pgData.pgName) errors.pgName = 'PG Name is required';
  if (!pgData.address) errors.address = 'Address is required';
  if (!pgData.city) errors.city = 'City is required';
  if (!pgData.state) errors.state = 'State is required';
  if (!pgData.pincode) errors.pincode = 'Pincode is required';
  if (!pgData.contactNumber) errors.contactNumber = 'Contact Number is required';
  if (!pgData.totalRooms) errors.totalRooms = 'Total Rooms is required';
  if (!pgData.totalBeds) errors.totalBeds = 'Total Beds is required';
  if (!pgData.rentPerBed) errors.rentPerBed = 'Rent per Bed is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

export const calculateRevenue = (payments) => {
  return payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
};

export const filterPGsByStatus = (pgs, status) => {
  return pgs.filter(pg => pg.status === status);
};

export const getSummaryStats = (pgs, users, payments) => {
  const owners = users.filter(u => u.role === 'Owner');
  const tenants = users.filter(u => u.role === 'Tenant');
  
  return {
    totalPGs: pgs.length,
    totalOwners: owners.length,
    totalTenants: tenants.length,
    totalRevenue: calculateRevenue(payments),
    pendingPGs: filterPGsByStatus(pgs, 'pending').length,
    approvedPGs: filterPGsByStatus(pgs, 'approved').length,
  };
};
