import { create } from "zustand";
import blogService from "./services/blogs";
import userService from "./services/users";
import loginService from "./services/login";

const useNotificationStore = create((set) => ({
  notification: null,
  actions: {
    setNotification: (message) => set(() => ({ notification: message })),
  },
}));

const useBlogStore = create((set) => ({
  blogs: [],
  newBlog: {
    title: "",
    author: "",
    url: "",
  },
  actions: {
    initialize: async () => {
      const blogs = await blogService.getAll();
      set(() => ({ blogs }));
    },
    add: async (newBlog) => {
      await blogService.create(newBlog);
      const updatedBlogs = await blogService.getAll();
      set(() => ({ blogs: updatedBlogs }));
    },
    update: async (newBlog, blogId) => {
      await blogService.update(newBlog, blogId);
      const updatedBlogs = await blogService.getAll();
      set(() => ({ blogs: updatedBlogs }));
    },
    remove: async (blogId) => {
      await blogService.remove(blogId);
      const updatedBlogs = await blogService.getAll();
      set(() => ({ blogs: updatedBlogs }));
    },
    setNewBlog: (newBlog) =>
      set((state) => ({
        newBlog:
          typeof newBlog === "function" ? newBlog(state.newBlog) : newBlog,
      })),
  },
}));

const useUserStore = create((set) => ({
  users: [],
  user: null,
  username: "",
  password: "",
  actions: {
    initialize: async () => {
      const users = await userService.getAll();
      set(() => ({ users }));
    },
    setUser: (user) => set(() => ({ user })),
    checkLoggedIn: async () => {
      const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        set(() => ({ user }));
        blogService.setToken(user.token);
      }
    },
    setUsername: (username) => set(() => ({ username })),
    setPassword: (password) => set(() => ({ password })),
    login: async (username, password) => {
      const loggedInUser = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedInUser),
      );

      blogService.setToken(loggedInUser.token);
      set(() => ({ user: loggedInUser }));
      set(() => ({ username: "" }));
      set(() => ({ password: "" }));
    },
    logout: async () => {
      window.localStorage.removeItem("loggedBlogappUser");
      blogService.setToken(null);

      set(() => ({ user: null }));
      set(() => ({ username: "" }));
      set(() => ({ password: "" }));
    },
  },
}));

export const useNotification = () =>
  useNotificationStore((state) => state.notification);
export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useNewBlog = () => useBlogStore((state) => state.newBlog);
export const useBlogActions = () => useBlogStore((state) => state.actions);

export const useUsers = () => useUserStore((state) => state.users);
export const useUser = () => useUserStore((state) => state.user);
export const useUsername = () => useUserStore((state) => state.username);
export const usePassword = () => useUserStore((state) => state.password);
export const useUserActions = () => useUserStore((state) => state.actions);
