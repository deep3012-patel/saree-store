import axios from "axios";

const API_URL = "https://saree-store-api.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Make sure these are EXPORTED correctly
export const getAllSarees = async (page = 1, limit = 10) => {
  const response = await api.get(`/sarees/all?page=${page}&limit=${limit}`);
  return response.data;
};

export const getSareeById = async (id) => {
  const response = await api.get(`/sarees/${id}`);
  return response.data;
};

export const searchSarees = async (keyword) => {
  const response = await api.get(`/sarees/search?keyword=${keyword}`);
  return response.data;
};

export const filterByPrice = async (min, max) => {
  const response = await api.get(`/sarees/filter/price?min=${min}&max=${max}`);
  return response.data;
};

export const getByMaterial = async (material) => {
  const response = await api.get(`/sarees/material/${material}`);
  return response.data;
};

export const getByCategory = async (category) => {
  const response = await api.get(`/sarees/category/${category}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get("/sarees/stats");
  return response.data;
};
