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

export const getUserGoals = createAsyncThunk(
    'auth/getUserGoals',
    async (goalId) => {
        try {
            const response = goalId
                ? await axiosConfig.get(`/goal/${goalId}`)
                : await axiosConfig.get('/goal');

            return response.data.data;
        } catch (error) {
            toastErrorMessage('Failed to get user goals', error);
            return null;
        }
    }
);

export const createGoal = createAsyncThunk('auth/createGoal', async (data) => {
    try {
        const response = await axiosConfig.post('/goal', data);
        toastSuccessMessage('Goal Created Successfully', response);
        return response.data.data;
    } catch (error) {
        toastErrorMessage('Failed to create goal', error);
        return null;
    }
});

export const updateGoal = createAsyncThunk(
    'auth/updateGoal',
    async ({ goalId, data }) => {
        try {
            console.log({ data });
            const response = await axiosConfig.patch(`/goal/${goalId}`, data);
            toastSuccessMessage('Goal Updated Successfully', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Failed to update goal', error);
            return null;
        }
    }
);

export const deleteGoal = createAsyncThunk(
    'auth/deleteGoal',
    async (goalId) => {
        try {
            const response = await axiosConfig.delete(`/goal/${goalId}`);
            toastSuccessMessage('Goal Deleted Successfully', response);
            return response.data.data;
        } catch (error) {
            toastErrorMessage('Failed to delete goal', error);
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

        // getUserGoals
        builder.addCase(getUserGoals.pending, (_) => {});
        builder.addCase(getUserGoals.fulfilled, (state, action) => {
            state.userData.goals = action.payload;
        });
        builder.addCase(getUserGoals.rejected, (_) => {});

        // createGoal
        builder.addCase(createGoal.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createGoal.fulfilled, (state, action) => {
            state.loading = false;
            if (!state.userData.goals) state.userData.goals = [];
            state.userData.goals.push(action.payload);
        });
        builder.addCase(createGoal.rejected, (state) => {
            state.loading = false;
        });

        // updateGoal
        builder.addCase(updateGoal.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(updateGoal.fulfilled, (state, action) => {
            state.loading = false;
            const updatedGoal = action.payload;
            if (!updatedGoal) return;
            state.userData.goals = state.userData.goals.map((goal) =>
                goal._id === updatedGoal._id ? updatedGoal : goal
            );
        });
        builder.addCase(updateGoal.rejected, (state) => {
            state.loading = false;
        });

        // deleteGoal
        builder.addCase(deleteGoal.pending, (_) => {});
        builder.addCase(deleteGoal.fulfilled, (state, action) => {
            state.userData.goals = state.userData.goals.filter(
                (goal) => goal._id !== action.payload._id
            );
        });
        builder.addCase(deleteGoal.rejected, (_) => {});
    },
});

export default authSlice.reducer;
