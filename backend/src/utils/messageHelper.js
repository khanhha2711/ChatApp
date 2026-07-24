export const updateConversationAfterCreateMessage = (
  conversation,
  message,
  senderId,
) => {
  conversation.lastMessageAt = message.createdAt;

  conversation.lastMessage = {
    messageId: message._id,
    content: message.content,
    senderId,
  };

  conversation.participants.forEach((participant) => {
    if (participant.userId.toString() === senderId.toString()) {
      participant.unreadCount = 0;
    } else {
      participant.unreadCount += 1;
    }
  });
};

export const emitNewMessage = (io, conversation, message) => {
  console.log(conversation);
  conversation.participants.forEach((participant) => {
    const conversationData = {
      ...conversation.toObject(),
      unreadCount: participant.unreadCount,
    };

    io.to(participant.userId.toString()).emit("new-message", {
      message,
      conversation: conversationData,
    });
  });
};
