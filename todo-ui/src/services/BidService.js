import axios from "axios";

const API_URL = "http://localhost:8080/api/bids";

// Save a new bid
const saveBid = (bidData) => {
  return axios.post(API_URL, bidData);
};

// Get a bid by its ID
const getBidById = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

// Update a bid by its ID
const updateBid = (id, bidData) => {
  return axios.put(`${API_URL}/${id}`, bidData);
};

// Delete a bid by its ID
const deleteBid = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};

// Get all bids for a specific todoId
const getBidsByTodoId = (todoId) => {
  return axios.get(`${API_URL}/todo/${todoId}`);
};

const BidService = {
  saveBid,
  getBidById,
  updateBid,
  deleteBid,
  getBidsByTodoId, // Add the new method here
};

export default BidService;