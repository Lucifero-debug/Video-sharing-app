import { createSlice } from "@reduxjs/toolkit";

const initialState={
    viewsCount:0
}

export const viewSlice=createSlice({
    name:'views',
    initialState,
    reducers:{
        updateViewsCount:(state,action)=>{
          state.viewsCount=action.payload;
        },
        increamentViewsCount:(state)=>{
            state.viewsCount++;
        }
    }
})




export const { updateViewsCount,increamentViewsCount } = viewSlice.actions
export default viewSlice.reducer