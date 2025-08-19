import mongoose from "mongoose"
import {Comment} from "../models/comments.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    try {
        const comments=await Comment.find({video:videoId})
        // console.log("comment is:",comments)
        return res
        .status(200)
        .json(new ApiResponse(200,comments,"Comments fetched Succesfully"))
    } catch (error) {
        throw new ApiError(400,"Comments cannot fetched")
    }
})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const {content}=req.body
    if(content==="" || !content){
        throw new ApiError(400,"Content of comment is required")
    }
    console.log("Requested body:",req.body)
    const comment=await Comment.create({
     content:content,
     video:videoId,
     owner:req.user?._id
    })
  await comment.save()
  return res.status(201).json(new ApiResponse(201, comment, "Comment added successfully"));

})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {videoId}=req.params
    const {newContent}=req.body
    const updatedComment=await Comment.findOne({
        owner:req.user?._id,
        video:videoId
    })
    console.log("Updated comments:",updatedComment)
    await Comment.findByIdAndUpdate(
        updatedComment._id,
        {
        $set:{
    content:newContent
            }
        },
        {new:true}
        )
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {videoId} = req.params
    const deletedComment=await Comment.findOne({
        owner:req.user?._id,
        video:videoId
    })
    console.log("Deleted comments:",deletedComment)
    await Comment.findByIdAndDelete(deletedComment._id,{new:true})
    return res
    .status(200)
    .json(
        new ApiResponse(200,"Comment deleted successfully")
    )
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }