import { createSlice } from '@reduxjs/toolkit'


const initialState={
    currentUser:null,
    loading:false,
    error:false
}

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
   loginStart:(state)=>{
    state.loading=true;  
   },
   loginSuccess:(state,action)=>{
    state.loading=true;
    state.currentUser=action.payload;
   },
   loginFailure:(state)=>{
    state.loading=false;
    state.error=true;
   },
   logout:(state)=>{
    state.currentUser=null;
    state.loading=false;
    state.error=false;
   },
   subscription:(state,action)=>{
if (state.currentUser.subscribedUser.includes(action.payload)) {
  state.currentUser.subscribedUser.splice(state.currentUser.subscribedUser.findIndex(channelId=>channelId===action.payload))
} else{
  state.currentUser.subscribedUser.push(action.payload)
}
   },
 
  },
})


// Action creators are generated for each case reducer function
export const { loginStart,loginFailure,loginSuccess,logout,subscription } = currentUserSlice.actions

export default currentUserSlice.reducer
