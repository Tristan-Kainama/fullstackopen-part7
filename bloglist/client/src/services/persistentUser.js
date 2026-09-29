const storageKey = "loggedBlogappUser";

export const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem(storageKey);
  return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
};

export const saveUser = (user) => {
  window.localStorage.setItem(storageKey, JSON.stringify(user));
};

export const removeUser = () => {
  window.localStorage.removeItem(storageKey);
};
