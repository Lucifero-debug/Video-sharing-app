import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
import {Video} from "../models/video.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import  Jwt  from "jsonwebtoken"
import { dislikes } from "../../../mega-frontend/src/redux/videoSlice.js"

const generateAccessAndRefreshTokens=async(userId)=>{
    try {
       const user=await User.findById(userId)
      const accessToken =user.generateAccessToken()
      const refreshToken=user.generateRefreshToken()

      user.refreshToken=refreshToken
      await user.save({validateBeforeSave : false})

      return {accessToken,refreshToken}

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser= asyncHandler(async (req,res)=>{
   const {fullName,email,username,password}=req.body
   // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res
if (fullName==="") {
    throw new ApiError(400,"fullName is required")
}
if (email==="") {
    throw new ApiError(400,"email is required")
}
if (username==="") {
    throw new ApiError(400,"username is required")
}
if (password==="") {
    throw new ApiError(400,"password is required")
}

const existedUser =await User.findOne({
    $or:[{ username },{ email }]
})

if (existedUser) {
    throw new ApiError(409,"User with email or username already exists")
}
console.log("Received request body:", req.body);
 console.log("Received files:", req.files);
let avatarLocalPath= req.files?.avatar[0]?.path
// const coverImageLocalPath= req.files?.coverImage[0]?.path

let coverImageLocalPath
if (req.files&&Array.isArray(req.files.coverImage)&&req.files.coverImage.length > 0) {
    coverImageLocalPath=req.files.coverImage[0].path
}

if (!avatarLocalPath) {
    avatarLocalPath="https://th.bing.com/th/id/OIP.qw42y3S9KyR2Wn9JVAWArgHaHa?rs=1&pid=ImgDetMain"
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)
if (!avatar) {
    throw new ApiError(400,"Avatar file is required")
}

const user= await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase()
})

const createdUser= await User.findById(user._id).select(
    "-password -refreshToken"
)
console.log(req.files)
if (!createdUser) {
    throw new ApiError(500,"Something went wrong while registering the user")
}

return res.status(200).json(
   new ApiResponse(200,createdUser,"User registered Successfully"),
)

})

const loginUser=asyncHandler(async(req,res)=>{
const {email,username,password}=req.body
console.log("requested body:",req.body)
if (!username && !email) {
   throw new ApiError(400,"username or email is required") 
}
const user= await User.findOne({
    $or: [{username},{email}]
})

if (!user) {
    throw new ApiError(404,"User does not exist")
}

 const isPasswordValid = await user.isPasswordCorrect(password)
 if (!isPasswordValid) {
    throw new ApiError(401,"password incorrect")
}

const {accessToken,refreshToken} =await generateAccessAndRefreshTokens(user._id)

const loggedInUser=await User.findById(user._id).select("-password -refreshToken")

const options ={
    httpOnly:true,
    secure:true
}
console.log("logged in user:",loggedInUser)
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
    new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User logged In Successfully"
    )
)

})

const logoutUser=asyncHandler(async(req,res)=>{
await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
)

const options={
    httpOnly:true,
    secure:true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User logged Out"))

})

const refreshAccessToken=asyncHandler(async(req,res)=>{
   const incominRefreshToken =req.cookies.refreshToken || req.body.refreshToken

if (!incominRefreshToken) {
    throw new ApiError(401,"unauthorised request")
}

try {
    const decodedToken= jwt.verify(
        incominRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
    
      const user= await User.findById(decodedToken?._id)
    
      if (!user) {
        throw new ApiError(401,"Invalid refresh token")
    }
    
    if (incominRefreshToken !==user?.refreshToken) {
        throw new ApiError(401,"Refresh token is expired or used")
    }
    
    const options={
        httpOnly:true,
        secure:true
    }
    
    const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {accessToken,refreshToken:newRefreshToken},
            "Access token refreshed"
        )
    )
} catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token")
}

})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body

    const user= await User.findById(req.user?._id)
  const isPasswordCorrect =await user.isPasswordCorrect(oldPassword)
  if (!isPasswordCorrect) {
    throw new ApiError(400,"Invalid old password")
  }

  user.password=newPassword
  await user.save({validateBeforeSave:false})

return res
.status(200)
.json(new ApiResponse(200,{},"Password changed succesfully"))

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse (200,req.user,"current user fetched successfully"))
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName,email} = req.body

    if (!fullName || !email) {
        throw new ApiError (400,"All fields are required")
    }

  const user =await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName:fullName,
                email:email
            }
        },
        {new:true}
).select("-password")

return res
.status(200)
.json(new ApiResponse(200,user,"Account details updated Successfully"))
})

const updateUserName=asyncHandler(async(req,res)=>{
    const {username}=req.body
    if (!username) {
        throw new ApiError(400,"Username is required")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                username:username
            }
        },
        {new:true}
    ).select("-password")
    return res
.status(200)
.json(new ApiResponse(200,user,"username updated Successfully"))

})

const updateUserAvatar=asyncHandler(async(req,res)=>{
   const avatarLocalPath =req.file?.path

   if (!avatarLocalPath) {
    throw new ApiError(400,"Avatar file is missing")
   }

  const avatar= await uploadOnCloudinary(avatarLocalPath)

  if (!avatar.url) {
    throw new ApiError(400,"Error while uploading avatar")
  }

 const user= await User.findByIdAndUpdate(
    req.user?._id,
    {
        $set:{
            avatar:avatar.url
        }
    },
    {new:true}
  ).select("-password")
  return res
  .status(200)
  .json(
   new ApiResponse(200,user,"Avatar updated successfully")
  )
})
const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath =req.file?.path
 
    if (!coverImageLocalPath) {
     throw new ApiError(400,"Cover Image file is missing")
    }
 
   const coverImage= await uploadOnCloudinary(coverImageLocalPath)
 
   if (!coverImage.url) {
     throw new ApiError(400,"Error while uploading cover Image")
   }
 
  const user= await User.findByIdAndUpdate(
     req.user?._id,
     {
         $set:{
             coverImage:coverImage.url
         }
     },
     {new:true}
   ).select("-password")
   return res
   .status(200)
   .json(
    new ApiResponse(200,user,"Cover image updated successfully")
   )
 })

const getUserChannelProfile=asyncHandler(async(req,res)=>{
 const {username}= req.params

 if (!username?.trim()) {
    throw new ApiError(400,"username is missing")
 }

  const channel= await User.aggregate([
    {
        $match:{
            username:username?.toLowerCase()
        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"channel",
            as:"subscribers"
        }
    },
    {
        $lookup:{
            from:"subscriptions",
            localField:"_id",
            foreignField:"subscriber",
            as:"subscribedTo"
        }
    },
    {
        $addFields:{
            subcribersCount:{
                $size:"$subscribers"
            },
            channelsSubscribedToCount:{
                $size:"$subscribedTo"
            },
            isSubscribed:{
                $cond:{
                    if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                    then:true,
                    else:false
                }
            }
        }
    },
    {
        $project:{
            fullName:1,
            username:1,
            subscribersCount:1,
            channelsSubscribedToCount,
            isSubscribed:1,
            avatar:1,
            coverImage:1,
            email:1
        }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(404,"channel does not exists")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200,channel[0],"User channel fetched successfully")
)
})

const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        fullName:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        }
    ])
    console.log("watch history is:",user)
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "watch history fetched successfully"
        )
    )
})

const getUser=asyncHandler(async(req,res)=>{
    const {userId}=req.params
    const user=await User.findById(userId)
    if (!user) {
        throw new ApiError(400,"user does not exist")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"user fetched successfully")
    )
})
const subscribe=asyncHandler(async(req,res)=>{
    const videoUser=req.params.videoUser
    console.log("requested params is:",req.params.videoUser)
    try {
      await User.findByIdAndUpdate(req.user._id,{
        $push:{ subscribedUser:videoUser }
      }) 
      await User.findByIdAndUpdate(videoUser,{
        $inc:{ subscribers:1 }
      }) 
      console.log("subscribed")
      return res
      .status(200)
      .json(
        new ApiResponse(200,"User subscribed successfully")
      )
    } catch (error) {
      throw new ApiError(400,"Error while Subscribing")  
    }
})
const unsubscribe=asyncHandler(async(req,res)=>{
    const videoUser=req.params.videoUser
    try {
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{ subscribedUser:videoUser }
          }) 
          await User.findByIdAndUpdate(videoUser,{
            $inc:{ subscribers:-1 }
          }) 
          console.log("unsubscribed")
          return res
          .status(200)
          .json(
            new ApiResponse(200,"User Unsubscribed successfully")
          )
    } catch (error) {
        throw new ApiError(400,"Error while Unsubscribing")
    }
})

const googleAuth=asyncHandler(async(req,res)=>{
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
          const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json(user._doc);
        } else {
          const newUser = new User({
            ...req.body,
            fromGoogle: true,
          });
          const savedUser = await newUser.save();
          const token = jwt.sign({ id: savedUser._id }, process.env.ACCESS_TOKEN_SECRET);
          res
            .cookie("access_token", token, {
              httpOnly: true,
            })
            .status(200)
            .json(savedUser._doc);
        }
      } catch (error) {
        throw new ApiError(400,"Error while signing with google",error)
      }
})

const togglelikes=asyncHandler(async(req,res)=>{
    let response,action
const {videoId}=req.params
    const liked=await Video.findByIdAndUpdate(
        videoId,
        {
            $push:{likes:req.user._id},
            $pull:{dislikes:req.user._id}
        },
        {new:true}
    )
    response="Video Liekd Succesfully"
    action=liked
return res
.status(200)
.json(
    new ApiResponse(200,action,response)
)
})

const toggledislikes=asyncHandler(async(req,res)=>{
    let response,action
    const {videoId}=req.params
        const disliked=await Video.findByIdAndUpdate(
            videoId,
            {
                $push:{dislikes:req.user._id},
                $pull:{likes:req.user._id}
            },
            {new:true}
        )
       response="Video disliked successfully"
    action=disliked
    return res
    .status(200)
    .json(
        new ApiResponse(200,action,response)
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    updateUserName,
    getUserChannelProfile,
    getWatchHistory,
    getUser,
    subscribe,
    unsubscribe,
    googleAuth,
    togglelikes,
    toggledislikes
}