import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments)
router.route("/addcomment/:videoId").post(verifyJWT,addComment);
router.route("/deletecomment/:videoId").post(verifyJWT,deleteComment)
router.route("/updatecomment/:videoId").post(verifyJWT,updateComment)

export default router