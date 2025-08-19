import { Router } from 'express';
import {
    addTags,
    addView,
    deleteVideo,
    find,
    getAllVideos,
    getByTags,
    getVideoById,
    publishAVideo,
    random,
    search,
    sub,
    togglePublishStatus,
    trend,
    updateVideo,
} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/publish").post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),verifyJWT,
        publishAVideo
    );

router.route("/:videoId/update").post(
    upload.fields([
        {
            name:"thumbnail",
            maxCount:1
        }
    ])
    ,verifyJWT,updateVideo)
    
    router.route("/:videoId/delete").post(verifyJWT,deleteVideo)

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);
router.route("/:videoId/addview").post(verifyJWT,addView)
router.route("/random").get(random)
router.route("/trend").get(trend)
router.route("/tags").get(getByTags)
router.route("/sub").get(verifyJWT,sub)
router.route("/find/:videoId").get(find)
router.route("/addtag/:videoId").post(verifyJWT,addTags)
router.route("/search").get(search)

export default router