import type { Socket } from "socket.io-client";
import type { Conversation, Message } from "./chat";
import type { Friend, FriendRequest } from "./friend";
import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;
  clearState: () => void;
  setAccessToken: (token: string) => void;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refreshToken: () => Promise<void>;
  signInGoogle: (token: string) => Promise<void>;
}

export interface ChatState {
  isLoading: boolean;
  conversations: Conversation[];
  activeConversation: string | null;
  messages: Record<
    string,
    {
      items: Message[];
      hasMore: boolean; // infinite-scroll
      nextCursor?: string | null; // phân trang
    }
  >;
  convoLoading: boolean;
  messLoading: boolean;
  setActiveConversation: (id: string) => void;
  getConversation: () => Promise<void>;
  createConversation: (
    type: "group" | "direct",
    name: string,
    memberIds: string[],
  ) => Promise<void>;
  getMessages: (ConversationId?: string) => Promise<void>;
  sendDirectMessage: (recipientId: string, content: string) => Promise<void>;
  sendGroupMessage: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
  updateConversation: (updatedConversation: Conversation) => void;
  maskAsSeen: () => Promise<void>;
  addConvo: (conversation: Conversation) => void;
}

export interface FriendState {
  friends: Friend[];
  receivedRequests: FriendRequest[];
  sentRequests: FriendRequest[];
  isLoading: boolean;
  fetchFriends: () => Promise<void>;
  fetchFriendRequests: () => Promise<void>;
  sendFriendRequest: (to: string, message?: string) => Promise<string>;
  rejectFriendRequest: (requestId: string) => Promise<void>;
  acceptFriendRequest: (requestId: string) => Promise<void>;
  searchUserByEmail: (email: string) => Promise<User | null>;
  searchFriend: (keyword: string) => Promise<Friend[]>;
}

export interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  connectSocket: () => void;
  disconnectSocket: () => void;
}
