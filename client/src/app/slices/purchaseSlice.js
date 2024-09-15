import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosConfig from '@/utils/axiosConfig';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/index.js';

// Initial state
const initialState = {
    loading: false,
    status: false,
    cartData: null,
    purchasedCourses: null,
    error: null,
};

// Async thunks for API calls

// Fetch cart courses
export const getCartCourses = createAsyncThunk(
    'purchase/getCartCourses',
    async () => {
        try {
            const response = await axiosConfig.get('/purchase/cart');
            console.log(response)
            return response.data;
        } catch (error) {
            toastErrorMessage(error.message);
            return toastErrorMessage("Something went wrong while fetching cart courses");
        }
    }
);

// Add courses to cart
export const addCoursesToCart = createAsyncThunk(
    'purchase/addCoursesToCart',
    async ( courseId ) => {
        console.log("courseId : ",courseId);
        try {
            const response = await axiosConfig.post('/purchase/cart', { courseIds: [courseId] });
            console.log(response.data)
            toastSuccessMessage('Course added to cart successfully');
            return response.data;
        } catch (error) {
            console.log("Error : ",error);
            toastErrorMessage(error.message);
            return null
        }
    }
);

// Remove course from cart
export const removeCourseFromCart = createAsyncThunk(
    'purchase/removeCourseFromCart',
    async (courseId) => {
        try {
            const response = await axiosConfig.delete(`/purchase/cart/${courseId}`);
            toastSuccessMessage('Course removed from cart');
            return response.data;
        } catch (error) {
            toastErrorMessage(error.message);
            return null
        }
    }
);

// Fetch purchased courses
export const getPurchasedCourses = createAsyncThunk(
    'purchase/getPurchasedCourses',
    async () => {
        try {
            const response = await axiosConfig.get('/');
            return response.data;
        } catch (error) {
            toastErrorMessage(error.message);
            return null
        }
    }
);

// Add course to purchased list
export const addCourse = createAsyncThunk(
    'purchase/addCourse',
    async (courseData) => {
        console.log(courseData)
        try {
            const response = await axiosConfig.post('/purchase', courseData);
            toastSuccessMessage('Course purchased successfully');
            return response.data;
        } catch (error) {
            toastErrorMessage(error.message);
            return null
        }
    }
);

// Create slice
const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        clearCart(state) {
            state.cartData = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle getCartCourses
            .addCase(getCartCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCartCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload.data;
                state.error = null;
            })
            .addCase(getCartCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle addCoursesToCart
            .addCase(addCoursesToCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCoursesToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload;
                state.error = null;
            })
            .addCase(addCoursesToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle removeCourseFromCart
            .addCase(removeCourseFromCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeCourseFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartData = action.payload;
                state.error = null;
            })
            .addCase(removeCourseFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle getPurchasedCourses
            .addCase(getPurchasedCourses.pending, (state) => {
                state.loading = true;
            })
            .addCase(getPurchasedCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.purchasedCourses = action.payload;
                state.error = null;
            })
            .addCase(getPurchasedCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Handle addCourse
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.purchasedCourses = action.payload;
                state.error = null;
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export the reducer and actions
export const { clearCart } = purchaseSlice.actions;

export default purchaseSlice.reducer;
