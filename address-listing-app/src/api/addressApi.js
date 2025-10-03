import axios from 'axios';

const API_BASE_URL = 'https://localhost:7221/api';

export const fetchAddresses = async () => {
    const response = await axios.get(`${API_BASE_URL}/addresses`);
    console.log(response.data);
    return response.data;
};

export const fetchAddressById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/addresses/${id}`);
    return response.data;
};

export const createAddress = async (address) => {
    const response = await axios.post(`${API_BASE_URL}/addresses`, address);
    return response.data;
};

export const updateAddress = async (id, address) => {
    const response = await axios.put(`${API_BASE_URL}/addresses/${id}`, address);
    return response.data;
};

export const deleteAddress = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/addresses/${id}`);
    return response.data;
};

