import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      clearState: () => {
        set({ accessToken: null, user: null });
      },

      setAccessToken: (token) => {
        set({ accessToken: token });
      },

      signUp: async (name, email, password) => {
        try {
          set({ loading: true });
          await authService.signUp(name, email, password);
          toast.success("Đăng ký thành công");
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true });
          const { accessToken } = await authService.signIn(email, password);
          get().setAccessToken(accessToken);
          await get().fetchMe();
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      logOut: async () => {
        try {
          await authService.logOut();
          get().clearState();
        } catch (error) {
          console.error(error);
          throw error;
        }
      },

      fetchMe: async () => {
        try {
          set({ loading: true });
          const { user } = await authService.fetchMe();
          set({ user });
        } catch (error) {
          console.error(error);
          set({ user: null, accessToken: null });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      refreshToken: async () => {
        try {
          set({ loading: true });
          const { setAccessToken, user, fetchMe } = get();
          const { accessToken } = await authService.refresh();
          setAccessToken(accessToken);
          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          get().clearState();
        } finally {
          set({ loading: false });
        }
      },

      signInGoogle: async (token) => {
        try {
          set({ loading: true });
          const { accessToken } = await authService.signInGoogle(token);
          get().setAccessToken(accessToken);
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: "auth-storage", partialize: (state) => ({ user: state.user }) },
  ),
);
