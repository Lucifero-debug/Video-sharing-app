import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {Video} from "../models/video.models.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    const videoPublished=await Video.findById(videoId)
    if (!videoPublished) {
        throw new ApiError(400,"video is not available")
    }
    console.log("Requested user is:",req.user)
    const videoDislike=await Like.findOne({
        video:videoId,
        likedby:req.user._id
    })
    let action
    let response
    if (videoDislike) {
        await Like.findByIdAndDelete(videoDislike._id,{new:true})
        console.log("Video disliked:",videoDislike)
        action=videoDislike
        response="Video Disliked Successfully"
    }
    else
    { 
        const videoLike=await Like.create({
        video:videoId,
        likedby:req.user?._id
    })
    console.log("video liked is:",videoLike)
    action=videoLike
        response="Video liked Successfully"
   
    }
    return res.status(200).json(
        new ApiResponse(200,action,response)
        )
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    
    const commentPublished=await Video.findById(commentId)
    if (!commentPublished) {
        throw new ApiError(400,"comment is not available")
    }
    console.log("Requested user is:",req.user)
    const commentDislike=await Like.findOne({
        comment:commentId,
        likedby:req.user._id
    })
    let action
    let response
    if (commentDislike) {
        await Like.findByIdAndDelete(commentDislike._id,{new:true})
        console.log("Comment disliked:",commentDislike)
        action=commentDislike
        response="Comment Disliked Successfully"
    }
    else
    { 
        const commentLike=await Like.create({
        comment:commentId,
        likedby:req.user?._id
    })
    console.log("comment liked is:",commentLike)
    action=commentLike
        response="Comment liked Successfully"
   
    }
    return res.status(200).json(
        new ApiResponse(200,action,response)
        )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}