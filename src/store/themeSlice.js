import { createSlice } from "@reduxjs/toolkit";
const storedTheme = localStorage.getItem("theme");
let theme;
if(storedTheme){
    theme = storedTheme
}else{
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
}

const themeSlice = createSlice({
    name: "theme",
    initialState: {
        theme
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', action.payload);
        },
    },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;