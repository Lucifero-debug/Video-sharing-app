import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId/create").post(verifyJWT,createTweet);
router.route("/get").get(getUserTweets);
router.route("/:tweetId/update").post(verifyJWT,updateTweet)
router.route("/:tweetId/delete").post(verifyJWT,deleteTweet)

export default router