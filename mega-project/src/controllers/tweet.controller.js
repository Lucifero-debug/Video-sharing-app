import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body

if (!content || content==="") {
    throw new ApiError(400,"Content of tweet is required")
}

    const createdTweet=await Tweet.create({
     content:content,
     owner:req.user?._id
    })
    return res
    .status(200)
    .json(
        new ApiResponse(200,createdTweet,"Tweet published successfullly")
    )
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const viewedTweet=await Tweet.find({
        owner:req.user?._id
    })
    if (!viewedTweet) {
        throw new ApiError(400,"Tweets does not exist")
    }
    console.log("Tweets are:",viewedTweet)
    return res
    .status(200)
    .json(
    new ApiResponse(200,viewedTweet,"Tweet fetched successfully")
    )
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
   const {content}=req.body
   const {tweetId}=req.params
   const updateTweet=await Tweet.findByIdAndUpdate(
    tweetId,
    {
        $set:{
           content:content 
        }
    },
    {new:true}
    )
    console.log("updated tweet:",updateTweet)
    return res
    .status(200)
    .json(
        new ApiResponse(200,updateTweet,"Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    const deletedTweet=await Tweet.findByIdAndDelete(
        tweetId,
        {new:true}
    )
    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedTweet,"Tweet deleted successfully")
    )
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}