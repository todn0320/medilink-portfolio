import { createSlice } from "@reduxjs/toolkit";


const initialState = {
   bottom: -400,
};

const loginSystemSummonSlice = createSlice({
   name: "lsss",
   initialState,
   reducers: {
      summon: (curState) => {
         if (curState.bottom === -400) {
            curState.bottom = 50;
            curState.opacity = 1;
         } else {
            curState.bottom = -400;
            curState.opacity = 0;
         }
      },
      hide: (curState) => {
         curState.bottom = -400;
         curState.opacity = 0;
      },
   },
});

export const { summon, hide } = loginSystemSummonSlice.actions;

export default loginSystemSummonSlice.reducer;
