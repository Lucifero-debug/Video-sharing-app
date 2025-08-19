import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    console.log("requested body:",req.body)
    if (!name || !description || name==="" || description==="") {
        throw new ApiError(400,"Name and description are required")
    }
    let thumbnailLocalPath=req.body.thumbnail
    if (!thumbnailLocalPath) {
        throw new ApiError(400,"Thumbnail is required")
    }
    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) {
        throw new ApiError(400,"error uploading thumbnail")
    }
    console.log("thumbnail is:",thumbnail)
    //TODO: create playlist
   const playlist=await Playlist.create({
    name:name,
    description:description,
    owner:req.user?._id,
    thumbnail:thumbnail.url
   })
if (!playlist) {
    throw new ApiError(400,"Error creating while playlist")
}
return res
.status(200)
.json(
    new ApiResponse(200,playlist,"Successfully created playlist")
)
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    const userPlaylist=await Playlist.find({
owner:userId
    })
    if (!userPlaylist) {
        throw new ApiError(400,"playlist does not exist")
    }
    // console.log("fetched playlists are:",userPlaylist)
    return res
    .status(200)
    .json(
        new ApiResponse(200,userPlaylist,"Successfully fetched playlists")
    )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const requestedPlaylist=await Playlist.findById(playlistId)
    if (!requestedPlaylist) {
        throw new ApiError(400,"requested playlist does not exist")
    }
    console.log("playlist you request is:",requestedPlaylist)
    return res
    .status(200)
    .json(
        new ApiResponse(200,requestedPlaylist,"playlist fetched successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const addVideo=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{
                videos:videoId
            }
        },
        {new:true}
    )
    if (!addVideo) {
        throw new ApiError(400,"error while adding video to playlist")
    }
    console.log("added playlist is:",addVideo)
    const newPlaylist=await Playlist.findById(playlistId)
    return res
    .status(200)
    .json(
        new ApiResponse(200,newPlaylist,"Video added to playlist successfully")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const removedVIdeo=await Playlist.findByIdAndUpdate(
        playlistId,
       {
        $pull:{
            videos:videoId
        }
       },
       {new:true}
    )
    if (!removedVIdeo) {
        throw new ApiError(400,"Error in removing video from playlist")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,removedVIdeo,"Video deleted from playlist successfully")
    )
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const deletePlaylist=await Playlist.findByIdAndDelete(playlistId,{new:true})
    if (!deletePlaylist) {
        throw new ApiError(400,"error while deleting playlist")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,deletePlaylist,"Playlist deleted successfully")
    )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {newName, newDescription} = req.body
    let thumbnailLocalPath=req.body.thumbnail
    console.log("thumbnail file:",req.body)
    const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)
    if (!thumbnail) {
        throw new ApiError(400,"error uploading thumbnail")
    }

    //TODO: update playlist
    const existingPlaylist=await Playlist.findById(playlistId)
    if (!existingPlaylist) {
        throw new ApiError(405,"Playlist does not exist")
    }

    const updatedName=newName || existingPlaylist.name;
    const updatedDescription=newDescription || existingPlaylist.description;
    
    const updatedPlaylist=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:updatedName,
                description:updatedDescription,
                thumbnail:thumbnail
            }
        },
        {new:true}
    )
    if (!updatedPlaylist) {
        throw new ApiError(400,"error while updating playlist")
    }
console.log("updated playlist:",updatedPlaylist)
    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedPlaylist,"Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}