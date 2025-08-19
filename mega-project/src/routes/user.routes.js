import {Router} from "express"
import { logoutUser, registerUser,loginUser,refreshAccessToken, updateAccountDetails, updateUserName, changeCurrentPassword, updateUserAvatar, updateUserCoverImage, getCurrentUser, getUserChannelProfile, getWatchHistory, getUser, subscribe,unsubscribe,googleAuth, togglelikes,toggledislikes} from "../controllers/user.controller.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router= Router()

router.route("/register").post(
    upload.fields([
     {
        name:"avatar",
        maxCount:1
     },
     {
        name:"coverImage",
        maxCount:1
     }
    ]),
    registerUser
    )
    router.route("/login").post(loginUser)

    router.route("/logout").post(verifyJWT, logoutUser)
    router.route("refresh-token").post(refreshAccessToken)
    router.route("/updatedetails").patch(verifyJWT,updateAccountDetails)
    router.route("/updateuser").post(verifyJWT,updateUserName)
    router.route("/currentuser").post(verifyJWT,getCurrentUser)
    router.route("/changecover").patch(verifyJWT,upload.fields("coverImage"),updateUserCoverImage)
    router.route("/changeavatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
    router.route("/changepassword").post(verifyJWT,changeCurrentPassword)
    router.route("/username").get(verifyJWT,getUserChannelProfile)
    router.route("/history").get(verifyJWT,getWatchHistory)
    router.route("/find/:userId").get(getUser)
    router.route("/sub/:videoUser").put(verifyJWT,subscribe)
    router.route("/unsub/:videoUser").put(verifyJWT,unsubscribe)
    router.route("/google").post(googleAuth)
    router.route("/togglelike/:videoId").post(verifyJWT,togglelikes)
    router.route("/toggledislike/:videoId").post(verifyJWT,toggledislikes)

export default router