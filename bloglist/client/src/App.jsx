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

import { useNotificationActions, useBlogActions } from "./store";

const App = () => {
  const { setNotification } = useNotificationActions();
  const { initialize: initializeBlogs } = useBlogActions();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeBlogs();
  }, [initializeBlogs]);

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
                <Blog users={users} user={user} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <BlogList />
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
                <AddBlogForm />
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
