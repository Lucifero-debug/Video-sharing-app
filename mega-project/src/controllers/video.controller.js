import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
 if (!title || !description || title==="" || description==="") {
    throw new ApiError(400,"title and description is required")
 }

 
//  console.log("Received request body:", req.body);
//  console.log("Received files:", req.files);
 if (!req.body || !req.body.thumbnail || !req.body.videoFile) {
    throw new ApiError(400, "Thumbnail and video files are required")
}
 let thumbnailLocalPath=req.body.thumbnail
let videoLocalPath=req.body.videoFile
if (!videoLocalPath) {
    throw new ApiError(400,"video file is required")
}
if (!thumbnailLocalPath) {
    throw new ApiError(400,"Thumbnail is required")
}
// console.log("video local path:",videoLocalPath)
// console.log("thumbnail local path:",thumbnailLocalPath)
const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)
const video=await uploadOnCloudinary(videoLocalPath)
if (!video) {
    throw new ApiError(400,"error uploading video")
}
if (!thumbnail) {
    throw new ApiError(400,"error uploading thumbnail")
}
const tags=req.body.tags
// console.log("video file:",video)
// console.log("thumbnail file:",thumbnail)
// console.log("Tags are:",tags)
const uploadedVideo = await Video.create({
videoFile:video?.url,
title:title,
description:description,
thumbnail:thumbnail?.url,
duration:video.duration || 0,
owner:req.user,
tags:tags
})

const createdVideo = await Video.findById(uploadedVideo._id);

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while create the video document")
    }


return res
.status(200)
.json(
    new ApiResponse(200,createdVideo,"video published succesfully")
)
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video = await Video.findById({videoId})
    if (!video) {
        throw new ApiError(400,"video does not exist")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"video fetched successfully")
    )
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const {newTitle,newDescription}=req.body
    // console.log("requested body:",req.body)

    if (!newTitle || !newDescription || newTitle==="" || newDescription==="") {
        throw new ApiError(400,"title and description is required")
     }
// console.log("requested files:",req.files)
     if (!req.files || !req.files.thumbnail) {
        throw new ApiError(400, "Thumbnail is required")
    }

    let thumbnailLocalPath=req.files.thumbnail[0].path
    // console.log(thumbnailLocalPath)

const thumbnail= await uploadOnCloudinary(thumbnailLocalPath)
// console.log("uploaded file:",thumbnail)

if (!thumbnail) {
    throw new ApiError(400,"error uploading thumbnail")
}
const updatedVideo=await Video.findByIdAndUpdate(
    videoId,
    {
        $set:{
            title:newTitle,
            description:newDescription,
            thumbnail:thumbnail?.url
        }
    },
    {new:true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,updateVideo,"video updated successfully")
    )
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    const deletedVideo=await Video.findByIdAndDelete(videoId)
    return res
    .status(200)
    .json(
        new ApiResponse(200,"video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})
const addView = asyncHandler(async (req,res) => {
 const { videoId }=req.params
//  console.log("requested user:",req.user._id)
 try {
    const video=await Video.findById(videoId)
   if (req.user._id!==video.owner.toString()) {
    if (!video.views.includes(req.user._id)) {
      const videoViews= await Video.findByIdAndUpdate(
           videoId,
           {
               $push:{views:req.user._id}
           },
           {new:true}
           )
           console.log("views added on this:",videoViews)
           return res
           .status(200)
           .json(
            new ApiResponse(200,"Views added successfully")
           )
    }else{
        throw new ApiError(402,"already viewed this video")
    }
   }else{
    throw new ApiError(403,"user is owner of the video")
   }
 } catch (error) {
    throw new ApiError(400,"views could not be added",error)
 }
})
const random= asyncHandler(async (req,res) =>{
    try {
      const video= await Video.aggregate([{ $sample: {size:40} }])  
      return res
      .status(200)
      .json(
        new ApiResponse(200,video,"Random videos fetched Successfully")
      )
    } catch (error) {
       throw new ApiError(403,"Cannot fetch random videos") 
    }
})
const sub=asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        console.log("sub user is:",user)
        const subscribedChannels = user?.subscribedUser || [];
        console.log("sub subscribed channel is:",subscribedChannels)
        const list = await Promise.all(
          subscribedChannels.map(async (channelId) => {
            return await Video.find({ owner: channelId });
          })
        );
    console.log("video list is:",list[1])
        return res
        .status(200)
        .json(new ApiResponse(200,list[1],"fetched all subscribed videos"));
      } catch (error) {
        throw new ApiError(400,"error while fetching subscribed videos")
      }
})
const trend = asyncHandler(async (req, res) => {
    try {
        const videos = await Video.aggregate([
            { $addFields: { viewsCount: { $size: "$views" } } }, 
            { $sort: { viewsCount: -1 } } 
        ]);
        
        return res.status(200).json(new ApiResponse(200, videos, "Trending videos fetched successfully"));
    } catch (error) {
        throw new ApiError(403, "Trending videos cannot be fetched");
    }
});
const getByTags= asyncHandler(async (req,res) =>{
    const tags=req.query.tags.split(",")
    console.log("requested user is:",req.user._id)
    try {
       const videos=await Video.find({tags:{$in:tags}}).limit(20) 
    //    console.log("Video by tags are:",videos)
       return res
       .status(200)
       .json(
        new ApiResponse(200,videos,"fetched videos by tags successfully")
       ) 
    } catch (error) {
        throw new ApiError(403,"Error fetching videos by tags")
    }
})
const find=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    // const {userId}=req.params
    const video=await Video.findById(videoId)
    // console.log("current user:",userId)
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            $push:{
                watchHistory:videoId
            }
        },
        {new:true}
    )
    if (!video) {
        throw new ApiError(400,"Error while fetching requested video")
    }
    if (!user) {
        throw new ApiError(403,"Error while Adding video to watch history")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,video,"Successfully fetched video")
    )
})
const addTags=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    const {tags}=req.body
    const newTag=await Video.findByIdAndUpdate(
        videoId,
        {
            $push:{
                tags:tags
            }
        },
        {new:true}
    )
    if (!newTag) {
        throw new ApiError(400,"Error while adding tags")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,newTag,"Successfully added tags")
    )
})
const search=asyncHandler(async(req,res)=>{
    const query=req.query.search;
    // console.log("Query is:",query)
    try {
       const videos=await Video.find({
        title:{$regex:query,$options:"i"},
       }).limit(40)
       if (!videos) {
        throw new ApiError(400,"Error finding the particular video")
       } 
       console.log("Searched Videos are:",videos)
       return res
       .status(200)
       .json(
        new ApiResponse(200,videos,"Successfully Fetched Searched Videos")
       )
    } catch (error) {
        throw new ApiError(400,"Error while searching video")
    }
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
    addView,
    random,
    trend,
    sub,
    getByTags,
    find,
    addTags,
    search
}