import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: false,
    topicsData: null,
};

export const quizSlice = createSlice({
    name: 'quiz',
    initialState,
    reducers: {
        topics: (state, action) => {
            state.status = true;
            state.userData = action.payload.topicsData;
        }
    },
});

export const { topics } = quizSlice.actions;

export default quizSlice.reducer;
