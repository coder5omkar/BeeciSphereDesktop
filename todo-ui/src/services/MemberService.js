import axios from "axios";
import { getToken } from "./AuthService";

const BASE_REST_API_URL = 'http://localhost:8080/api/members';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    
    config.headers['Authorization'] = getToken();

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  
export const getAllMembers = () => axios.get(BASE_REST_API_URL)

export const saveMember = (member) => axios.post(BASE_REST_API_URL, member)

export const getMember = (id) => axios.get(BASE_REST_API_URL + '/' + id)

export const updateMember = (id, member) => axios.put(BASE_REST_API_URL + '/' + id, member)

export const deleteMember = (id) => axios.delete(BASE_REST_API_URL + '/' + id)

export const getMemberByBCID = (BCID) => 
  axios.get(`${BASE_REST_API_URL}/members/${BCID}`);
