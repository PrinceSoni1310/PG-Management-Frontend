import axios from 'axios';

const DEFAULT_API_HOST = window?.location?.hostname || 'localhost';
const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${DEFAULT_API_HOST}:3000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
});

console.log("API BASE URL:", api.defaults.baseURL);

// Add token to requests
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/user/login', data),
  register: (data) => api.post('/user/register', data),
  addTenant: (data) => api.post('/user/add-tenant', data),
  forgotPassword: (data) => api.post('/user/forgotpassword', data),
  resetPassword: (data) => api.put('/user/resetpassword', data),
  getUsers: () => api.get('/user/users'),
  updateUser: (id, data) => api.put(`/user/user/${id}`, data),
  changePassword: (data) => api.put('/user/changepassword', data),
  deleteUser: (id) => api.delete(`/user/user/${id}`),
  getProfile: (id) => api.get(`/user/${id}`),
};

// PG APIs
export const pgAPI = {
  createPG: (data) => api.post('/pg', data),

  getPGs: (ownerId, status) => {
    const params = new URLSearchParams();
    if (ownerId) params.append('ownerId', ownerId);
    if (status) params.append('status', status);

    const query = params.toString() ? `?${params.toString()}` : '';

    return api.get(`/pg${query}`);
  },

  getOwnerPGs: (ownerId, status) => {
    const owner = ownerId || sessionStorage.getItem('userId');
    const params = new URLSearchParams();
    if (owner) params.append('ownerId', owner);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/pg${query}`);
  },

  adminGetAllPGs: (status) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/pg${query}`);
  },

  updatePG: (id, data) => api.put(`/pg/${id}`, data),
  deletePG: (id) => api.delete(`/pg/${id}`),

  approvePG: (id) => api.put(`/pg/${id}/approve`),
  rejectPG: (id) => api.put(`/pg/${id}/reject`),
};

// Room APIs
export const roomAPI = {
  createRoom: (data) => api.post('/room', data),
  getRooms: (pgId) => api.get(`/room?pgId=${pgId}`),
  updateRoom: (id, data) => api.put(`/room/${id}`, data),
  deleteRoom: (id) => api.delete(`/room/${id}`),
};

// ================= PAYMENT APIs =================
export const paymentAPI = {
  // create payment (optional)
  createPayment: (data) => api.post('/payment', data),

  // 🔥 ADMIN (THIS IS YOUR FIX)
  getAllPayments: () => api.get('/payment'),

  // tenant payments
  getPayments: () => api.get('/payment/my'),
  getTenantPayments: () => api.get('/payment/my'),

  // owner payments
  getOwnerPayments: () => api.get('/payment/owner'),

  // razorpay
  createOrder: (data) => api.post('/payment/order', data),
  verifyPayment: (data) => api.post('/payment/verify', data),

  // mock payment (no gateway)
  confirmMockPayment: (data) => api.post('/payment/mock', data),

  // upi
  confirmUpiPayment: (data) =>
    api.post('/payment/confirm-upi', data),

  // cash (IMPORTANT - you added new feature)
  confirmCashPayment: (data) =>
    api.post('/payment/cash', data),

  // owner creates a paid cash record for a tenant
  ownerConfirmCash: (data) => api.post('/payment/owner/cash', data),

  markPaymentPaid: (paymentId) =>
    api.put(`/payment/${paymentId}/mark-paid`),
  unmarkPaymentPaid: (paymentId) =>
    api.put(`/payment/${paymentId}/unmark-paid`),
};

// Complaint APIs
export const complaintAPI = {
  createComplaint: (data) => api.post('/complaint', data),
  getTenantComplaints: () => api.get('/complaint/tenant'),
  getOwnerComplaints: (pgId) => {
    const query = pgId ? `?pgId=${pgId}` : '';
    return api.get(`/complaint/owner${query}`);
  },
  updateComplaintStatus: (complaintId, data) => api.put(`/complaint/${complaintId}`, data),
  deleteComplaint: (complaintId) => api.delete(`/complaint/${complaintId}`),
};

// Food APIs
export const foodAPI = {
  createFood: (data) => api.post('/foodMenu/create', data),
  getFood: (pgId, menuType, date) => {
    const params = new URLSearchParams();
    if (pgId) params.append('pgId', pgId);
    if (menuType) params.append('menuType', menuType);
    if (date) params.append('date', date);
    return api.get(`/foodMenu?${params.toString()}`);
  },
  updateFood: (id, data) => api.put(`/foodMenu/${id}`, data),
  deleteFood: (id) => api.delete(`/foodMenu/${id}`),
  getAllFood: () => api.get('/foodMenu'),
};

// Notice APIs
export const noticeAPI = {
  createNotice: (data) => api.post('/notice', data),
  getNotices: (pgId) => api.get(`/notice?pgId=${pgId}`),
  updateNotice: (id, data) => api.put(`/notice/${id}`, data),
  deleteNotice: (id) => api.delete(`/notice/${id}`),
};

// Review APIs
export const reviewAPI = {
  createReview: (data) => api.post('/review', data),
  getReviews: (pgId) => api.get(`/review?pgId=${pgId}`),
  updateReview: (id, data) => api.put(`/review/${id}`, data),
  deleteReview: (id) => api.delete(`/review/${id}`),
};

// Tenant Request APIs
export const tenantRequestAPI = {
  create: (body) => api.post('/tenant-request', body),
  tenantList: (status) => api.get(`/tenant-request/tenant${status ? `?status=${status}` : ''}`),
  ownerList: (status, pgId) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (pgId) params.append('pgId', pgId);
    const query = params.toString() ? `?${params.toString()}` : '';
    return api.get(`/tenant-request/owner${query}`);
  },
  updateStatus: (requestId, body) => api.put(`/tenant-request/${requestId}`, body),
};

export default api;
