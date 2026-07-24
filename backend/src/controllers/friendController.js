import mongoose from "mongoose";
import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";
import Friend from "../models/Friend.js";
import { io } from "../socket/index.js";

export const searchFriend = async (req, res) => {
  try {
    const { keyword } = req.query;
    const userId = req.user._id;
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ message: "Không hợp lệ" });
    }

    const friendShip = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    });

    const friendIds = friendShip.map((friend) =>
      friend.userA.toString() === userId.toString()
        ? friend.userB
        : friend.userA,
    );

    const friends = await User.find({
      _id: { $in: friendIds },
      name: { $regex: keyword, $options: "i" },
    }).select("_id name");

    return res.status(200).json({ friends });
  } catch (error) {
    console.error("Lỗi xảy ra khi tìm bạn bè", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const searchUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email.trim() === "") {
      return res.status(400).json({ message: "Không hợp lệ" });
    }

    const user = await User.findOne({ email }).select("_id name");
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi xảy ra khi searchUserByUsername", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    console.log(req.body);
    const from = req.user._id;
    if (!mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({
        message: "ID không hợp lệ",
      });
    }
    if (from.toString() === to) {
      return res
        .status(400)
        .json({ message: "Không gửi lời mời kết bạn cho chính mình" });
    }

    const userExist = await User.exists({ _id: to });

    if (!userExist) {
      return res.status(400).json({ message: "Người nhận không tồn tại" });
    }

    const [userA, userB] = [from.toString(), to.toString()].sort();

    const [friendShip, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (friendShip) {
      return res.status(400).json({ message: "Đã là bạn bè" });
    }
    if (existingRequest) {
      return res.status(400).json({ message: "Đã có lời mời kết bạn" });
    }

    const friendRequest = await FriendRequest.create({
      from,
      to,
      message,
    });

    return res
      .status(201)
      .json({ message: "Gửi lời mời kết bạn thành công", friendRequest });
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu kết bạn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const user = req.user;

    const populateFields = "_id name";

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: user._id }).populate("to", populateFields),
      FriendRequest.find({ to: user._id }).populate("from", populateFields),
      ,
    ]);

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách yêu cầu kết bạn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const id = req.params.requestId;
    const user = req.user;

    const request = await FriendRequest.findById(id);

    if (!request) {
      return res.status(404).json({ message: "Không tồn tại yêu cầu kết bạn" });
    }

    if (user._id.toString() !== request.to.toString()) {
      return res.status(403).json({ message: "Không thể chấp nhận lời mời" });
    }

    const [userA, userB] = [
      request.from.toString(),
      request.to.toString(),
    ].sort();

    await Friend.create({
      userA,
      userB,
    });

    await FriendRequest.findByIdAndDelete(id);

    const from = await User.findById(request.from).select("_id name").lean();

    return res.status(200).json({
      message: "Chấp nhận lời mời kết bạn thành công",
      newFriend: {
        _id: from?._id,
        name: from?.name,
      },
    });
  } catch (error) {
    console.error("Lỗi khi chấp nhận lời mời kết bạn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const id = req.params.requestId;
    const user = req.user;
    const request = await FriendRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Không tồn tại yêu cầu kết bạn" });
    }

    if (request.to.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Không thể từ chốt yêu cầu" });
    }

    await FriendRequest.findByIdAndDelete(id);

    return res.status(204).json({ message: "Từ chối lời mời thành công" });
  } catch (error) {
    console.error("Lỗi khi từ chối lời mời kết bạn", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const user = req.user;
    const friendship = await Friend.find({
      $or: [{ userA: user._id }, { userB: user._id }],
    })
      .populate("userA", "_id name ")
      .populate("userB", "_id name ")
      .lean();

    if (!friendship.length) {
      return res.status(200).json({ friends: [] });
    }

    const friends = friendship.map((f) =>
      f.userA._id.toString() === user._id.toString() ? f.userB : f.userA,
    );
    return res.status(200).json({ friends });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bạn bè", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
