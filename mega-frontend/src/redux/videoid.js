import { createSlice } from '@reduxjs/toolkit'

const initialState={
    currentVideoId:[],
    loading:false,
    error:false,
}


export const videoIdSlice = createSlice({
  name: 'videoid',
  initialState:{
    ...initialState,
  },
  reducers: {
   fetchStart:(state)=>{
    state.loading=true;  
   },
   fetchSuccess:(state,action)=>{
    state.loading=false;
    state.currentVideoId=action.payload;
   },
   fetchFailure:(state)=>{
    state.loading=false;
    state.error=true;
   },
  
  },
})

// Action creators are generated for each case reducer function
export const { fetchStart,fetchFailure,fetchSuccess } = videoIdSlice.actions

export default videoIdSlice.reducer
