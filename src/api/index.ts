import axios from "axios";

// 建立共用的 axios 實例
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// 自動攔截每個請求，加上 Authorization header
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
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


