export interface Participant {
  _id: string;
  name: string;
  joinedAt: string;
}

export interface Group {
  name: string;
  createdAt: string;
}

export interface LastMessage {
  _id: string;
  content: string;
  sender: {
    _id: string;
    name: string;
  };
  seenBy: string[];
}

export interface Conversation {
  _id: string;
  type: "group" | "direct";
  participants: Participant[];
  group: Group | null;
  lastMessageAt: string;
  lastMessage: LastMessage | null;
  createdAt: string;
  updatedAt: string;
  unreadCount: number;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  createdAt?: string | null;
  isOwn: boolean;
}
