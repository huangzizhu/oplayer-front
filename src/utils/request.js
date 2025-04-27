import axios from "axios";


const request = axios.create({
  baseURL: "/api",
  timeout: 50000,
});

request.interceptors.request.use(
  (config) => {
    const loginUser = JSON.parse(localStorage.getItem("loginUser"));
    if (loginUser) {
      config.headers.set("token", loginUser);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  })


request.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
