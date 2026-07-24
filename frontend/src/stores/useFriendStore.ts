import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { create } from "zustand";

export const useFriendStore = create<FriendState>((set, get) => ({
  friends: [],
  receivedRequests: [],
  sentRequests: [],
  isLoading: false,
  fetchFriends: async () => {
    try {
      set({ isLoading: true });
      const result = await friendService.getAllFriends();
      set({ friends: result });
    } catch (error) {
      console.error("Lỗi xảy ra khi lấy danh sách bạn bè", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFriendRequests: async () => {
    try {
      set({ isLoading: true });
      const { sent, received } = await friendService.getFriendRequest();
      set({ receivedRequests: received, sentRequests: sent });
    } catch (error) {
      console.error("Lỗi xảy ra khi lấy dữ liệu", error);
    } finally {
      set({ isLoading: false });
    }
  },

  sendFriendRequest: async (to, message) => {
    try {
      set({ isLoading: true });
      if (!message) return;
      const resultMessage = await friendService.sendFriendRequest(to, message);
      return resultMessage;
    } catch (error) {
      console.error("Lỗi xảy ra khi gửi lời mời", error);
    } finally {
      set({ isLoading: false });
    }
  },

  acceptFriendRequest: async (requestId) => {
    try {
      set({ isLoading: true });
      const { friends } = get();
      const newFriend = await friendService.acceptFriendRequest(requestId);
      const exist = friends.some((friend) => friend._id === newFriend._id);
      set((state) => ({
        receivedRequests: state.receivedRequests.filter(
          (r) => r._id !== requestId,
        ),
        friends: exist
          ? state.friends
          : [...state.friends, { _id: newFriend._id, name: newFriend.name }],
      }));
    } catch (error) {
      console.error("Lỗi xảy ra khi acceptRequest", error);
    } finally {
      set({ isLoading: false });
    }
  },

  rejectFriendRequest: async (requestId) => {
    try {
      set({ isLoading: true });
      await friendService.rejectFriendRequest(requestId);

      set((state) => ({
        receivedRequests: state.receivedRequests.filter(
          (r) => r._id !== requestId,
        ),
      }));
    } catch (error) {
      console.error("Có lỗi xảy ra khi từ chối yêu cầu kết bạn", error);
    } finally {
      set({ isLoading: false });
    }
  },

  searchUserByEmail: async (email) => {
    try {
      set({ isLoading: true });
      const user = await friendService.searchUserByEmail(email);
      return user;
    } catch (error) {
      console.error("Lỗi xảy ra khi tìm user bằng email", error);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  searchFriend: async (keyword) => {
    try {
      set({ isLoading: true });
      const friends = await friendService.searchFriend(keyword);
      return friends;
    } catch (error) {
      console.error("Lỗi xảy ra khi tìm bạn bè", error);
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
}));
