import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
    name: "auth",
    initialState:{
        isLogin: false,
        userData: null,
    },
    reducers:{
        loginData(state, action){
            state.isLogin = true;
            state.userData = action.payload;
        },
        logoutData(state){
            state.isLogin = false;
            state.userData = null;
        }
    }
})

export const { loginData, logoutData } = auth.actions;
export default auth.reducer;