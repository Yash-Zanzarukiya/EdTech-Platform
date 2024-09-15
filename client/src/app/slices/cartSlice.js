import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    axiosConfig,
    toastErrorMessage,
    toastSuccessMessage,
} from '@/utils/index.js';

const initialState = {
    loading: false,
    status: false,
    cartData: null,
};

const getCartItems = createAsyncThunk(
    'cart/getCartItems',
    async () => {
        try {
            const response = await axiosConfig.get('/');
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Fetching Cart Items Failed', error);
            return null;
        }
    }
);

const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (data) => {
        try {
            const response = await axiosConfig.post('/', data);
            toastSuccessMessage('Added To Cart', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Adding To Cart Failed', error);
            return null;
        }
    }
);

const removefromCart = createAsyncThunk(
    'cart/removefromCart',
    async (data) => {
        try {
            const response = await axiosConfig.delete(`/`, data);
            toastSuccessMessage('Removed From Cart', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Removing From Cart Failed', error);
            return null;
        }
    }
);


const courseSlice = createSlice({
    name: 'cart',
    initialState,
    extraReducers: (builder) => {
    
    }
});