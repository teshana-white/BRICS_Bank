import axios from 'axios';

const API_URL = 'http://localhost:8080'; 

export const registerUser = async (userData) => 
    {
        return axios.post(`${API_URL}/register`, userData);
    };

export const loginUser = async (credentials) => 
    {
        return axios.post(`${API_URL}/login`, credentials);
    };

export const getBudget = async (token, userId) => 
    {
        return axios.post(`${API_URL}/budget`, { userId }, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });
    };

export const makeSwiftPayment = async (token, paymentData) => 
    {
        return axios.post(`${API_URL}/transactions`, paymentData, 
            {
                headers: { Authorization: `Bearer ${token}` }
            });
};
