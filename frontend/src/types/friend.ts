export interface Friend {
  _id: string;
  name: string;
}

export interface FriendRequest {
  _id: string;

  from: Friend;

  to: Friend;

  message?: string;

  createdAt: string;

  updatedAt: string;
}
