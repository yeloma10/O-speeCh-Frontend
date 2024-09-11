import { create } from "zustand";
import { persist } from "zustand/middleware";
const useAuthStore = create(
  persist(
    (set) => ({
      isLoading: false,
      setIsLoading: (isLoading) => {
        set({ isLoading });
      },
      user: null,
      login: (accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({ isLoggedIn: true });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({ isLoggedIn: false });
      },
      setUser: (user) => {
        set({ user });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;
