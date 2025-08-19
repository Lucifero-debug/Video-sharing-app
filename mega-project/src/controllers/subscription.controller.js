import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const isSubscribed=await Subscription.findOne({
        subscriber:req.user?._id,
        channel:channelId
    })
    let action
    let response
    if (!isSubscribed) {
        const subscriber=await Subscription.create({
            subscriber:req.user?._id,
            channel:channelId
        })
        if (!subscriber) {
            throw new ApiError(400,"Error while subscribing the channel")
        }
        action=subscriber
        response="User Subscribed Successfully"
    }
    else{
        const unSubscribed=await Subscription.findOneAndDelete({
            subscriber:req.user?._id,
            channel:channelId
        })
        if (!unSubscribed) {
            throw new ApiError(400,"Error while unsubscribing the channel")
        }
        action=unSubscribed
        response="User unsubscribed Successfully"
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,action,response)
    )
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribers=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project:{
                fullName:1,
                userName:1,
                avatar:1
            }
        }
    ])
    console.log("Subscribers are:",subscribers)
    return res
    .status(200)
    .json(
        new ApiResponse(200,subscribers,"Successfully fetched all subscribers")
    )
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}