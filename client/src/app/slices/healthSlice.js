import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useToast } from '@/components/ui/use-toast';
import { axiosConfig } from '@/utils';

const initialState = {
    loading: false,
    status: false,
};

export const healthCheck = createAsyncThunk('health/healthCheck', async () => {
    const { toast } = useToast();
    try {
        await axiosConfig.get(`/health`);
    } catch (error) {
        toast({
            title: 'Oops! Our Server is Sick... 🤒',
            duration: 2000,
        });
        console.log(error);
    }
});

const healthSlice = createSlice({
    name: 'health',
    initialState,
    extraReducers: (builder) => {
        //Check Health
        builder.addCase(healthCheck.pending, (state) => {
            state.loading = true;
            state.status = false;
        });
        builder.addCase(healthCheck.fulfilled, (state) => {
            state.loading = false;
            state.status = true;
        });
        builder.addCase(healthCheck.rejected, (state) => {
            state.loading = false;
            state.status = false;
        });
    },
});

export default healthSlice.reducer;
