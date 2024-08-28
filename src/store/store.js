import { configureStore } from "@reduxjs/toolkit";
import themeSlice from "./themeSlice";
import auth from "./authSlice"

export const store = configureStore({
    reducer: {
        theme: themeSlice,
        auth,
    },
})