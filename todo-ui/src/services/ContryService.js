import axios from "axios";
import { getToken } from "./AuthService";

const BASE_REST_API_URL = 'http://localhost:8080/api/contries';

// Add a request interceptor to include the Authorization token in headers
axios.interceptors.request.use(
  function (config) {
    config.headers['Authorization'] = getToken();
    return config;
  },
  function (error) {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Fetch all contries
export const getAllContries = () => axios.get(BASE_REST_API_URL);

// Save a new contry
export const saveContry = (contry) => axios.post(BASE_REST_API_URL, contry);

// Fetch a specific contry by ID
export const getContry = (id) => axios.get(`${BASE_REST_API_URL}/${id}`);

// Update a contry by ID
export const updateContry = (id, contry) => axios.put(`${BASE_REST_API_URL}/${id}`, contry);

// Delete a contry by ID
export const deleteContry = (id) => axios.delete(`${BASE_REST_API_URL}/${id}`);

export const getContryById = (id) => axios.get(`${BASE_REST_API_URL}/${id}`);

export const getContryByMemberId = (memberId) => 
  axios.get(`${BASE_REST_API_URL}/member/${memberId}`);