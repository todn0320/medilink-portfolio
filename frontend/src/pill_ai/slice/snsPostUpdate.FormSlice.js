import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    css: {
        top: "-100%",
        left: "-100%",
    },
    content: {
        no: "",
        writer:"",
        txt:"",
    },
};

const snsPostSlice = createSlice({
    name: "Formup",
    initialState,
    reducers: {
        summonSPUF: (state, action) => {
            state.css = { top:0, left:0 };
        },
        hideSPUF: (state, action) => {
            state.css = {top:"-100%", left:"-100%"};
        },
        setContent: (state, action) => {
            state.content = {
                no: action.payload.no,
                writer: action.payload.writer,
                txt: action.payload.txt,
            };
        },
    },
});

export const { summonSPUF, hideSPUF, setContent } =
    snsPostSlice.actions;

export default snsPostSlice.reducer;
