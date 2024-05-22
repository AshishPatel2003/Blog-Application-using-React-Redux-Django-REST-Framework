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
        }
	},
});

export const { signInStart, signInSuccess, signInFailure, clearError, setAccessToken } = userSlice.actions; 

export default userSlice.reducer;
