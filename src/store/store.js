import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import auth from "./authSlice"
import messageSlice from "./messageSlice";

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        auth,
        message: messageSlice
    },
})