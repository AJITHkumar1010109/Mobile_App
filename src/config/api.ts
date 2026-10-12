export const API_BASE_URL = 'https://business-be-xdp6.onrender.com';

// Fallback or alternative endpoints if local development is needed:
// export const API_BASE_URL = 'http://localhost:4000'; // or local IP for physical devices

export const API_ENDPOINTS = {
  login: `${API_BASE_URL}/api/login`,
  changePassword: `${API_BASE_URL}/api/change-password`,
  user: (userId: number | string) => `${API_BASE_URL}/api/user/${userId}`,
  changeUsername: `${API_BASE_URL}/api/change-username`,
  verifyMenuPin: `${API_BASE_URL}/api/verify-menu-pin`,
  setMenuPin: `${API_BASE_URL}/api/set-menu-pin`,
  customers: `${API_BASE_URL}/api/customers`,
  customerById: (id: string) => `${API_BASE_URL}/api/customers/${id}`,
  customerPayment: (id: string) => `${API_BASE_URL}/api/customers/${id}/payment`,
};
