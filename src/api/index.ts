import axios from "axios";

// 建立共用的 axios 實例
const api = axios.create({
  baseURL: import.meta.env.MODE === 'development'
    ? 'http://localhost:8080/api' // 開發環境：本機
    : 'https://backend-918891597518.asia-east1.run.app/api', // 正式環境： API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// 自動攔截每個請求，加上 Authorization header
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user !== null) {
    const parsed = JSON.parse(user);
    const token = parsed.user.token;
    console.log("TOKEN:", token);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;


