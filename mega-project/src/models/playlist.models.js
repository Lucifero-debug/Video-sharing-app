import mongoose, { Schema } from "mongoose";

const playlistsSchema=new Schema ({
    name:{
    type:String,
    required:true
    },
    description:{
    type:String,
    required:true
    },
    owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
    },
    videos:[{
    type:Schema.Types.ObjectId,
    ref:"Video"
    }],
    thumbnail:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Playlist=mongoose.model("Playlist",playlistsSchema)