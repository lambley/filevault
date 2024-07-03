import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || `http://localhost:${process.env.REACT_APP_API_PORT}`;

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
