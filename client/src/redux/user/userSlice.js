import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: null,
	error: null,
	loading: false,
    accessToken: null
};

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		signInStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearError: (state, action) => {
            state.loading = action.payload
            state.error = null
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.loading = false;
            state.currentUser = action.payload;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
	},
});

export const { signInStart, signInSuccess, signInFailure, clearError, setAccessToken, updateStart, updateSuccess, updateFailure } = userSlice.actions; 

export default userSlice.reducer;
