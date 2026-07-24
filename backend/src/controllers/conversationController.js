import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";
import Message from "../models/Messages.js";
import { io } from "../socket/index.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      "participants.userId": userId,
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate({ path: "participants.userId", select: "name" })
      .lean();

    const formattedConversations = conversations.map((conversation) => {
      const me = conversation.participants.find(
        (p) => p.userId._id.toString() === userId.toString(),
      );
      const others = conversation.participants
        .filter((p) => p.userId._id.toString() !== userId.toString())
        .map((p) => ({
          _id: p.userId._id,
          name: p.userId.name,
        }));

      return {
        _id: conversation._id,
        type: conversation.type,
        participants: others,
        group: conversation.group,
        unreadCount: me?.unreadCount ?? 0,
        lastMessage: conversation.lastMessage,
        lastMessageAt: conversation.lastMessageAt,
      };
    });

    return res.status(200).json({ conversations: formattedConversations });
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy conversations", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, name, memberIds } = req.body;

    if (
      !type ||
      !Array.isArray(memberIds) ||
      memberIds.length === 0 ||
      (type === "group" && !name?.trim())
    ) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ",
      });
    }

    let conversation;

    if (type === "direct") {
      const participantId = memberIds[0];

      const [userA, userB] = [
        userId.toString(),
        participantId.toString(),
      ].sort();

      const friendShip = await Friend.findOne({
        userA,
        userB,
      });

      if (!friendShip) {
        return res.status(400).json({ message: "Không phải là bạn bè" });
      }

      conversation = await Conversation.findOne({
        type: "direct",
        "participants.userId": { $all: [userId, participantId] },
        participants: { $size: 2 },
      });

      if (!conversation) {
        conversation = new Conversation({
          type: "direct",
          participants: [{ userId }, { userId: participantId }],
          lastMessageAt: new Date(),
        });

        await conversation.save();
      }
    }

    if (type === "group") {
      conversation = new Conversation({
        type: "group",
        participants: [{ userId }, ...memberIds.map((id) => ({ userId: id }))],
        group: {
          name,
          createdBy: userId,
        },
        lastMessageAt: new Date(),
      });
      await conversation.save();
    }
    if (!conversation) {
      return res
        .status(400)
        .json({ message: "Conversation type không hợp lệ" });
    }

    await conversation.populate([
      { path: "participants.userId", select: "name " },
      { path: "lastMessage.senderId", select: "name" },
    ]);

    const participants = (conversation.participants || []).map((p) => ({
      _id: p.userId?._id,
      name: p.userId?.name,
      joinedAt: p.joinedAt,
    }));

    const formatted = { ...conversation.toObject(), participants };

    if (type === "group") {
      memberIds.forEach((userId) => {
        io.to(userId).emit("new-group", formatted);
      });
    }

    if (type === "direct") {
      io.to(memberIds[0]).emit("new-group", formatted);
    }

    return res.status(201).json({ conversation: formatted });
  } catch (error) {
    console.error("Lỗi khi tạo conversation", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { limit = 50, cursor } = req.query;
    const query = { conversationId };
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      "participants.userId": userId,
    });

    if (!conversation) {
      return res.status(403).json({
        message: "Không có quyền truy cập cuộc trò chuyện.",
      });
    }
    if (cursor) {
      query.createdAt = { $lt: new Date(cursor) };
    }

    let messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit) + 1);

    let nextCursor = null;

    if (messages.length > Number(limit)) {
      const nextMessage = messages[messages.length - 1];
      nextCursor = nextMessage.createdAt.toISOString();
      messages.pop();
    }

    messages = messages.reverse();

    return res.status(200).json({ messages, nextCursor });
  } catch (error) {
    console.error("Lỗi xảy ra khi lấy messages", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const markAsSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    const conversation = await Conversation.findById(conversationId).lean();

    if (!conversation) {
      return res.status(404).json({ message: "Conversation không tồn tại" });
    }

    const last = conversation.lastMessage;

    if (!last) {
      return res
        .status(200)
        .json({ message: "Không có tin nhắn để mark as seen" });
    }

    if (last.senderId.toString() === userId) {
      return res.status(200).json({ message: "Sender không cần mark as seen" });
    }

    const updatedConversation = await Conversation.findOneAndUpdate(
      {
        _id: conversationId,
        "participants.userId": userId,
      },
      {
        $set: {
          "participants.$.unreadCount": 0,
        },
        $addToSet: {
          "lastMessage.seenBy": userId,
        },
      },
      {
        new: true,
      },
    );

    io.to(conversationId).emit("read-message", {
      conversation: updatedConversation,
    });

    return res.status(200).json({
      message: "Marked as seen",
    });
  } catch (error) {
    console.error("Lỗi khi mark as seen", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getUserConversationsForSocketIO = async (userId) => {
  try {
    const conversations = await Conversation.find(
      { "participants.userId": userId },
      { _id: 1 },
    );

    return conversations.map((c) => c._id.toString());
  } catch (error) {
    console.error("Lỗi khi fetch conversations: ", error);
    return [];
  }
};
