import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(verifyJWT,createPlaylist)
router.route("/:userId/get").get(verifyJWT,getUserPlaylists)
router.route("/:playlistId/getone").get(verifyJWT,getPlaylistById)
router.route("/:playlistId/:videoId/add").post(verifyJWT,addVideoToPlaylist)
router.route("/:playlistId/:videoId/delete").post(verifyJWT,removeVideoFromPlaylist)
router.route("/:playlistId/remove").post(verifyJWT,deletePlaylist)
router.route("/:playlistId/update").post(verifyJWT,updatePlaylist)




export default router