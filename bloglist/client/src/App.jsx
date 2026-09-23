import { useState, useEffect, useRef } from "react";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlogForm from "./components/AddBlogForm";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import ErrorBoundary from "./components/ErrorBoundary";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import blogService from "./services/blogs";
import userService from "./services/users";
import loginService from "./services/login";

import { useNotificationActions } from "./store";

const App = () => {
  const { setNotification } = useNotificationActions();

  const [blogs, setBlogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users));
  });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem(
        "loggedBlogappUser",
        JSON.stringify(loggedInUser),
      );

      blogService.setToken(loggedInUser.token);
      setUser(loggedInUser);
      setUsername("");
      setPassword("");
      setNotification({
        text: `Successfully logged in as ${username}!`,
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return true;
    } catch {
      setNotification({ text: "Wrong credentials!", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return false;
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    setUser(null);
    setUsername("");
    setPassword("");

    setNotification({ text: "Successfully logged out!", type: "success" });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const createBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create({
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        likes: 0,
      });

      const allBlogs = await blogService.getAll();
      setBlogs(allBlogs);

      const blogTitle = createdBlog.title || newBlog.title;
      const blogAuthor = createdBlog.author || newBlog.author;

      setNotification({
        text: `A new blog ${blogTitle} by ${blogAuthor} added!`,
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch {
      setNotification({ text: "Failed to add blog", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const updateBlog = async (newBlog, blogId) => {
    if (user === null) {
      setNotification({ text: "User has to be logged in!", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return;
    }

    try {
      await blogService.update(
        {
          title: newBlog.title,
          author: newBlog.author,
          url: newBlog.url,
          likes: newBlog.likes,
        },
        blogId,
      );

      const allBlogs = await blogService.getAll();
      setBlogs(allBlogs);
    } catch {
      setNotification({ text: "Failed to update blog!", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const removeBlog = async (blogId) => {
    if (user === null) {
      setNotification({ text: "User has to be logged in!", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return;
    }

    try {
      const blogToDelete = await blogService.getBlog(blogId);
      await blogService.remove(blogId);

      const allBlogs = await blogService.getAll();
      setBlogs(allBlogs);

      setNotification({
        text: `${blogToDelete.title} by ${blogToDelete.author} blog has been sucessfully removed!`,
        type: "success",
      });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    } catch {
      setNotification({ text: "Failed to delete blog!", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  };

  const padding = {
    padding: 5,
  };

  const margin = {
    marginBottom: 10,
  };

  const style = { "&:hover": { bgcolor: "rgba(255,255,255,0.3)" } };

  return (
    <Container>
      <Router>
        <AppBar position="static" style={margin}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={style}>
              blogs
            </Button>
            {user ? (
              <Button color="inherit" component={Link} to="/create" sx={style}>
                new blog
              </Button>
            ) : null}
            {user ? (
              <Button
                color="inherit"
                style={padding}
                onClick={handleLogout}
                sx={style}
              >
                logout
              </Button>
            ) : (
              <Button color="inherit" component={Link} to="/login" sx={style}>
                login
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Notification />

        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <ErrorBoundary>
                <Blog
                  blogs={blogs}
                  users={users}
                  user={user}
                  updateBlog={updateBlog}
                  removeBlog={removeBlog}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <BlogList blogs={blogs} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              <ErrorBoundary>
                <LoginForm
                  handleLogin={handleLogin}
                  username={username}
                  password={password}
                  setUsername={setUsername}
                  setPassword={setPassword}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path="/create"
            element={
              <ErrorBoundary>
                <AddBlogForm createBlog={createBlog} />
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
