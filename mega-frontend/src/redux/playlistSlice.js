import { createSlice } from "@reduxjs/toolkit";

const initialState={
    currentplaylist:null,
}

export const playlistSlice=createSlice({
    name:'playlist',
    initialState,
    reducers:{
        updateplaylist:(state,action)=>{
          state.currentplaylist=action.payload;
        }
    }
})




export const { updateplaylist} = playlistSlice.actions
export default playlistSlice.reducer