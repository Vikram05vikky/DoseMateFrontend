import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080", // 👈 backend base URL
  baseURL : 'http://65.2.69.70:8080',

  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
