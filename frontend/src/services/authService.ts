import api from "@/lib/axios";

export const authService = {
  signUp: async (name: string, email: string, password: string) => {
    const res = await api.post("/auth/signup", { name, email, password });
    return res.data;
  },
  signIn: async (email: string, password: string) => {
    const res = await api.post("/auth/signin", { email, password });
    return res.data;
  },
  logOut: async () => {
    await api.post("/auth/logout");
  },

  fetchMe: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },

  signInGoogle: async (token: string) => {
    const res = await api.post("/auth/google", { token });
    return res.data;
  },
};
