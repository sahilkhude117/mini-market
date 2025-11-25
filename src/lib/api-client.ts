import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api/v1";

// Market API
export const marketAPI = {
  create: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/market/create`, data);
    return response.data;
  },
  
  add: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/market/add`, data);
    return response.data;
  },
  
  addLiquidity: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/market/addLiquidity`, data);
    return response.data;
  },
  
  betting: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/market/betting`, data);
    return response.data;
  },
  
  liquidity: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/market/liquidity`, data);
    return response.data;
  },
  
  get: async (params: { marketStatus?: string; page?: number; limit?: number }) => {
    const response = await axios.get(`${API_BASE_URL}/market/get`, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`${API_BASE_URL}/market/${id}`);
    return response.data;
  },
};

// Oracle API
export const oracleAPI = {
  registFeed: async (data: any) => {
    const response = await axios.post(`${API_BASE_URL}/oracle/registFeed`, data);
    return response.data;
  },
};

// Referral API
export const referralAPI = {
  get: async (data: { wallet: string; referralCode?: string }) => {
    const response = await axios.post(`${API_BASE_URL}/referral`, data);
    return response.data;
  },
  
  claim: async (data: { wallet: string; amount: number }) => {
    const response = await axios.post(`${API_BASE_URL}/referral/claim`, data);
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  get: async (wallet: string) => {
    const response = await axios.get(`${API_BASE_URL}/profile`, {
      params: { wallet },
    });
    return response.data;
  },
};
