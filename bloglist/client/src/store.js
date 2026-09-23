import { create } from "zustand";
import blogService from "./services/blogs";

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (message) => set(() => ({ notification: message })),
  },
}));

const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll();
      set(() => ({ blogs }));
    },
    add: async (newBlog) => {
      await blogService.create(newBlog);
      const updatedBlogs = await blogService.getAll();
      set((state) => ({ blogs: updatedBlogs }));
    },
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogActions = () => useBlogStore((state) => state.actions);
