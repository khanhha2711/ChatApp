import api from "@/lib/axios";

export const friendService = {
  getAllFriends: async () => {
    const res = await api.get("/friends/");
    return res.data.friends;
  },

  getFriendRequest: async () => {
    const res = await api.get("/friends/requests");
    const { sent, received } = res.data;
    return { sent, received };
  },

  sendFriendRequest: async (id: string, message: string) => {
    const res = await api.post("/friends/requests", { to: id, message });
    return res.data;
  },

  acceptFriendRequest: async (requestId: string) => {
    const res = await api.post(`/friends/requests/${requestId}/accept`);
    return res.data.newFriend;
  },

  rejectFriendRequest: async (requestId: string) => {
    const res = await api.post(`/friends/requests/${requestId}/reject`);
    return res.data;
  },

  searchUserByEmail: async (email: string) => {
    const res = await api.get(`/users/search?email=${email}`);
    return res.data.user;
  },

  searchFriend: async (keyword: string) => {
    const res = await api.get(`/friends/search?keyword=${keyword}`);
    return res.data.friends;
  },
};
