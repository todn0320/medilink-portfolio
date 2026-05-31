import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loginMember: [],
    signUpPage: false,
}

const memberSlice = createSlice({
    name: "pj",
    initialState,
    reducers:{
        setLoginMember: (state, action) => {
            state.loginMember = action.payload;
        },
        setSignUpPage: (state, action) => {
            state.signUpPage = action.payload;
        },
    },
});

export const { setLoginMember, setSignUpPage } = memberSlice.actions;

export default memberSlice.reducer;