import { createSlice } from "@reduxjs/toolkit"

const initialState={
    currentChannel:null,
    loading:false
}
export const currentChannelSlice=createSlice({
    name:'currentChannel',
    initialState,
    reducers:{
        fetchChannel:(state,action)=>{
            state.currentChannel=action.payload;
            state.loading=true;
        },
        increaseCount:(state)=>{
         state.currentChannel.subscribers+=1
        },
        decreaseCount:(state)=>{
            state.currentChannel.subscribers-=1
        }
    }
})

export const { fetchChannel,increaseCount,decreaseCount } = currentChannelSlice.actions

export default currentChannelSlice.reducer