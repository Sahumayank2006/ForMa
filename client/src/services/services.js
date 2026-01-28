import api from '../utils/api';

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/auth/updatedetails', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  updatePassword: async (passwords) => {
    const response = await api.put('/auth/updatepassword', passwords);
    return response.data;
  }
};

// Child services
export const childService = {
  getChildren: async () => {
    const response = await api.get('/children');
    return response.data;
  },

  getChild: async (id) => {
    const response = await api.get(`/children/${id}`);
    return response.data;
  },

  createChild: async (childData) => {
    const response = await api.post('/children', childData);
    return response.data;
  },

  updateChild: async (id, childData) => {
    const response = await api.put(`/children/${id}`, childData);
    return response.data;
  },

  deleteChild: async (id) => {
    const response = await api.delete(`/children/${id}`);
    return response.data;
  },

  addActivity: async (id, activityData) => {
    const response = await api.post(`/children/${id}/activity`, activityData);
    return response.data;
  }
};

// User services
export const userService = {
  getUsers: async (role = null) => {
    const response = await api.get('/users', { params: { role } });
    return response.data;
  },

  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  getCaretakers: async () => {
    const response = await api.get('/users/caretakers');
    return response.data;
  },

  getMothers: async () => {
    const response = await api.get('/users/mothers');
    return response.data;
  }
};

export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

// Activity services
export const activityService = {
  // Food
  addFood: async (foodData) => {
    const response = await api.post('/activities/food', foodData);
    return response.data;
  },
  getFoodLogs: async (childId, params = {}) => {
    const response = await api.get(`/activities/food/child/${childId}`, { params });
    return response.data;
  },
  getFoodSummary: async (childId) => {
    const response = await api.get(`/activities/food/summary/${childId}`);
    return response.data;
  },
  deleteFood: async (id) => {
    const response = await api.delete(`/activities/food/${id}`);
    return response.data;
  },

  // Diaper
  addDiaper: async (diaperData) => {
    const response = await api.post('/activities/diaper', diaperData);
    return response.data;
  },
  getDiaperLogs: async (childId, params = {}) => {
    const response = await api.get(`/activities/diaper/child/${childId}`, { params });
    return response.data;
  },
  getDiaperSummary: async (childId) => {
    const response = await api.get(`/activities/diaper/summary/${childId}`);
    return response.data;
  },
  checkOverdueDiapers: async () => {
    const response = await api.get('/activities/diaper/check-overdue');
    return response.data;
  },
  deleteDiaper: async (id) => {
    const response = await api.delete(`/activities/diaper/${id}`);
    return response.data;
  },

  // Sleep
  startSleep: async (sleepData) => {
    const response = await api.post('/activities/sleep/start', sleepData);
    return response.data;
  },
  endSleep: async (id, data) => {
    const response = await api.put(`/activities/sleep/end/${id}`, data);
    return response.data;
  },
  getSleepLogs: async (childId, params = {}) => {
    const response = await api.get(`/activities/sleep/child/${childId}`, { params });
    return response.data;
  },
  getSleepSummary: async (childId) => {
    const response = await api.get(`/activities/sleep/summary/${childId}`);
    return response.data;
  },
  deleteSleep: async (id) => {
    const response = await api.delete(`/activities/sleep/${id}`);
    return response.data;
  },

  // Play
  startPlay: async (playData) => {
    const response = await api.post('/activities/play/start', playData);
    return response.data;
  },
  endPlay: async (id, data) => {
    const response = await api.put(`/activities/play/end/${id}`, data);
    return response.data;
  },
  getPlayLogs: async (childId, params = {}) => {
    const response = await api.get(`/activities/play/child/${childId}`, { params });
    return response.data;
  },
  getPlaySummary: async (childId) => {
    const response = await api.get(`/activities/play/summary/${childId}`);
    return response.data;
  },
  deletePlay: async (id) => {
    const response = await api.delete(`/activities/play/${id}`);
    return response.data;
  },

  // Cry
  startCry: async (cryData) => {
    const response = await api.post('/activities/cry/start', cryData);
    return response.data;
  },
  endCry: async (id, data) => {
    const response = await api.put(`/activities/cry/end/${id}`, data);
    return response.data;
  },
  getCryLogs: async (childId, params = {}) => {
    const response = await api.get(`/activities/cry/child/${childId}`, { params });
    return response.data;
  },
  getCrySummary: async (childId) => {
    const response = await api.get(`/activities/cry/summary/${childId}`);
    return response.data;
  },
  deleteCry: async (id) => {
    const response = await api.delete(`/activities/cry/${id}`);
    return response.data;
  },

  // Timeline
  getTimeline: async (childId, date = null) => {
    const params = date ? { date } : {};
    const response = await api.get(`/activities/timeline/${childId}`, { params });
    return response.data;
  }
};

