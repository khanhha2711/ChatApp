import { io, Socket } from "socket.io-client";
import type { SocketState } from "@/types/store";
import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

const baseUrl = import.meta.env.VITE_SOCKET_URL;

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;
    if (existingSocket) return;

    const socket: Socket = io(baseUrl, {
      auth: { token: accessToken },
      transports: ["websocket"],
    });

    set({ socket });

    socket.on("connect", () => {
      console.log("Đã kết nối với socket");
    });
    socket.on("connect_error", (err) => {
      console.error("Connect error:", err);
    });

    socket.on("online-users", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("new-message", ({ conversation, message }) => {
      useChatStore.getState().addMessage(message);

      if (
        useChatStore.getState().activeConversation === message.conversationId &&
        message.senderId !== useAuthStore.getState().user?._id
      ) {
        useChatStore.getState().maskAsSeen();
      }
      useChatStore.getState().updateConversation(conversation);
    });

    socket.on("read-message", ({ conversation }) => {
      useChatStore.getState().updateConversation(conversation);
    });

    // new group chat
    socket.on("new-group", (conversation) => {
      useChatStore.getState().addConvo(conversation);
      socket.emit("join-conversation", conversation._id);
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
