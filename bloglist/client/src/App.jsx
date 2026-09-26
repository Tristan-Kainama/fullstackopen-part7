import { useState, useEffect, useRef } from "react";
import { Container, AppBar, Toolbar, Button, Typography } from "@mui/material";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import AddBlogForm from "./components/AddBlogForm";
import LoginForm from "./components/LoginForm";
import BlogList from "./components/BlogList";
import Users from "./components/Users";
import User from "./components/User";
import ErrorBoundary from "./components/ErrorBoundary";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import {
  useNotificationActions,
  useBlogActions,
  useUserActions,
  useUser,
} from "./store";

const App = () => {
  const { setNotification } = useNotificationActions();
  const { initialize: initializeBlogs } = useBlogActions();
  const {
    initialize: initializeUsers,
    checkLoggedIn,
    logout,
  } = useUserActions();

  const user = useUser();

  useEffect(() => {
    initializeBlogs();
  }, [initializeBlogs]);

  useEffect(() => {
    initializeUsers();
  }, [initializeUsers]);

  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  const handleLogout = (event) => {
    event.preventDefault();

    logout();

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
            <Button color="inherit" component={Link} to="/users" sx={style}>
              users
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
                <Blog />
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
            path="/users"
            element={
              <ErrorBoundary>
                <Users />
              </ErrorBoundary>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ErrorBoundary>
                <User />
              </ErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              <ErrorBoundary>
                <LoginForm />
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
