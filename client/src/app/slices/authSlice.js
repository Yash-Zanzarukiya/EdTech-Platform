import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosConfig, toastErrorMessage, toastSuccessMessage } from '@/utils';
const initialState = {
    loading: false,
    status: false,
    userData: {},
};

export const signIn = createAsyncThunk(
    'auth/signIn',
    async ({ identifier, password }) => {
        try {
            const response = await axiosConfig.post('/auth/signin', {
                identifier,
                password,
            });
            toastSuccessMessage('Welcome Back', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Sign In Failed', error);
            return null;
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        await axiosConfig.post('/auth/logout');
        toastSuccessMessage('Logged out Successfully');
    } catch (error) {
        toastErrorMessage('Logout Failed', error);
        return null;
    }
});

export const getUser = createAsyncThunk('auth/getUser', async () => {
    try {
        const response = await axiosConfig.get('/auth/me');
        return response.data.data;
    } catch (error) {
        return null;
    }
});

export const checkUsername = async (username) => {
    try {
        const response = await axiosConfig.get(`/auth/username/${username}`);
        return response.data.data;
    } catch (error) {
        return {
            isAvailable: false,
            message: 'failed to check username, please try later',
        };
    }
};

export const updateUserProfile = createAsyncThunk(
    'auth/updateUserProfile',
    async (data) => {
        const {
            fullName,
            university,
            gradYear,
            branch,
            bio,
            avatar,
            profileStatus,
        } = data;

        try {
            const response = await axiosConfig.patch('/user/profile', {
                profileStatus,
                university,
                fullName,
                gradYear,
                branch,
                bio,
            });

            if (avatar) {
                const formData = new FormData(
                    document.getElementById('personal-info-form')
                );

                if (formData.get('avatar')?.name) {
                    await axiosConfig.patch('/user/avatar', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                }
            }

            toastSuccessMessage('Profile Updated Successfully', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Update Profile Failed', error);
            return null;
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    extraReducers: (builder) => {
        //signIn
        builder.addCase(signIn.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(signIn.fulfilled, (state, action) => {
            state.loading = false;
            state.status = true;
            state.userData = action.payload;
        });
        builder.addCase(signIn.rejected, (state) => {
            state.loading = false;
            state.status = false;
            state.userData = null;
        });

        //logout
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state) => {
            state.loading = false;
            state.status = false;
            state.userData = null;
        });
        builder.addCase(logout.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });

        //getUser
        builder.addCase(getUser.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(getUser.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.status = true;
        });
        builder.addCase(getUser.rejected, (state) => {
            state.loading = false;
            state.userData = null;
            state.status = false;
        });

        // update profile
        builder.addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload;
            state.status = true;
        });
        builder.addCase(updateUserProfile.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default authSlice.reducer;
