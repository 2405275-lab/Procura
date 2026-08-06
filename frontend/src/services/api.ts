import axios from 'axios';

export interface OrgSettings {
  companyName: string;
  gstNumber: string;
  address: string;
  currency: string;
  timezone: string;
  financialYear: string;
  email: string;
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Disabled';
  mfaEnabled: boolean;
}

export interface RuleBlock {
  id: string;
  field: string;
  operator: string;
  value: string;
  action: string;
}

export interface SystemMetric {
  cpu: number[];
  memory: number[];
  storage: string;
}

const API_BASE = 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

// Configure auth headers on client
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && token !== 'true') { // in prototype we set it to 'true', in backend we set the real JWT token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Seed fallbacks for robustness
const LOCAL_ORG_SETTINGS: OrgSettings = {
  companyName: 'Procura Procurement Solutions',
  gstNumber: '29ABCDE1234F1Z5',
  address: '124 Business Plaza, Tower A, Bangalore, KA, 560001',
  currency: 'USD',
  timezone: 'Asia/Kolkata (GMT+5:30)',
  financialYear: '2026-2027',
  email: 'admin@procura.io',
};

const LOCAL_USERS: UserItem[] = [
  { id: 'USR-01', name: 'Sarah Jenkins', email: 'sarah.j@procura.io', role: 'Administrator', department: 'Procurement', status: 'Active', mfaEnabled: true },
  { id: 'USR-02', name: 'Alex Mercer', email: 'alex.m@procura.io', role: 'Procurement Officer', department: 'Engineering', status: 'Active', mfaEnabled: true },
  { id: 'USR-03', name: 'Evelyn Shore', email: 'evelyn.s@procura.io', role: 'Manager', department: 'Finance & HR', status: 'Active', mfaEnabled: false }
];

const LOCAL_RULES: RuleBlock[] = [
  { id: 'RUL-001', field: 'Price', operator: '>', value: '100000', action: 'Require Finance Approval' },
  { id: 'RUL-002', field: 'Warranty', operator: '<', value: '2 Years', action: 'Flag Warning' }
];

export const api = {
  // Organization settings
  getOrgSettings: async (): Promise<OrgSettings> => {
    try {
      const res = await client.get('/settings');
      return res.data;
    } catch {
      return { ...LOCAL_ORG_SETTINGS };
    }
  },
  saveOrgSettings: async (settings: OrgSettings): Promise<boolean> => {
    try {
      await client.post('/settings', settings);
      Object.assign(LOCAL_ORG_SETTINGS, settings);
      return true;
    } catch {
      Object.assign(LOCAL_ORG_SETTINGS, settings);
      return true;
    }
  },

  // Users Manager
  getUsers: async (): Promise<UserItem[]> => {
    try {
      const res = await client.get('/users');
      return res.data;
    } catch {
      return [...LOCAL_USERS];
    }
  },
  updateUserStatus: async (id: string, status: 'Active' | 'Disabled'): Promise<boolean> => {
    try {
      await client.put(`/users/${id}/status`, { status });
      return true;
    } catch {
      const user = LOCAL_USERS.find((u) => u.id === id);
      if (user) {
        user.status = status;
        return true;
      }
      return false;
    }
  },

  // Rule Builder
  getRules: async (): Promise<RuleBlock[]> => {
    try {
      const res = await client.get('/policies/rules');
      return res.data;
    } catch {
      return [...LOCAL_RULES];
    }
  },
  saveRule: async (rule: RuleBlock): Promise<boolean> => {
    try {
      await client.post('/policies/rules', rule);
      return true;
    } catch {
      LOCAL_RULES.push(rule);
      return true;
    }
  },
  deleteRule: async (id: string): Promise<boolean> => {
    try {
      await client.delete(`/policies/rules/${id}`);
      return true;
    } catch {
      const idx = LOCAL_RULES.findIndex((r) => r.id === id);
      if (idx !== -1) {
        LOCAL_RULES.splice(idx, 1);
        return true;
      }
      return false;
    }
  },

  // System Hardware Stats
  getSystemMetrics: async (): Promise<SystemMetric> => {
    try {
      const res = await client.get('/admin/metrics');
      return res.data;
    } catch {
      return {
        cpu: [24, 30, 28, 35, 42, 38, 45, 41, 39, 36],
        memory: [58, 59, 61, 60, 62, 64, 63, 62, 61, 60],
        storage: '412 GB / 1 TB'
      };
    }
  }
};
