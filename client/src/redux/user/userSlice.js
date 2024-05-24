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
        signOut: (state) => {
            state.currentUser = null;
            state.accessToken = null;
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
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state) => {
            state.loading = false;
            state.currentUser = null;
            state.error = null;
            state.accessToken = null;
        },
        deleteFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
	},
});

export const { signInStart, signInSuccess, signInFailure, signOut, clearError, setAccessToken, updateStart, updateSuccess, updateFailure, deleteStart, deleteSuccess, deleteFailure } = userSlice.actions; 

export default userSlice.reducer;
