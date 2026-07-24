import express from "express";
import {
  acceptFriendRequest,
  getAllFriends,
  getFriendRequests,
  rejectFriendRequest,
  searchFriend,
  searchUserByEmail,
  sendFriendRequest,
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/requests", sendFriendRequest);
router.get("/requests", getFriendRequests);
router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/reject", rejectFriendRequest);
router.get("/search", searchFriend);

router.get("/", getAllFriends);
export default router;
