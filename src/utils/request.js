import axios from "axios";


const request = axios.create({
  baseURL: "/op",
  timeout: 50000,
});
const uapiRequest = axios.create({
    baseURL: "/uapi",
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

export  {request,uapiRequest};