import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (message) => set(() => ({ notification: message })),
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);
