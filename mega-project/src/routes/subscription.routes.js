import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

 router.route("/:channelId/toggle").post(verifyJWT,toggleSubscription);
 router.route("/:channelId/subscribers").post(verifyJWT,getUserChannelSubscribers);


export default router