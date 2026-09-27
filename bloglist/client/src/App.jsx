import { useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";

import Blog from "./features/blogs/Blog";
import AddBlogForm from "./features/blogs/AddBlogForm";
import BlogList from "./features/blogs/BlogList";
import LoginForm from "./features/auth/LoginForm";
import User from "./features/users/User";
import Users from "./features/users/Users";
import ErrorBoundary from "./shared/components/ErrorBoundary";
import Notification from "./shared/components/Notification";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import {
  useNotificationActions,
  useBlogActions,
  useUserActions,
  useUser,
} from "./store";

const theme = createTheme({
  palette: {
    primary: { main: "#17634e", dark: "#104a3b" },
    secondary: { main: "#b34f39" },
    background: { default: "#f2f4ef", paper: "#fffefa" },
    text: { primary: "#1e2926", secondary: "#65716b" },
  },
  shape: { borderRadius: 5 },
  typography: {
    fontFamily: '"Aptos", "Segoe UI", sans-serif',
    button: { fontWeight: 700, textTransform: "none" },
    h1: { fontFamily: 'Georgia, "Times New Roman", serif' },
    h2: { fontFamily: 'Georgia, "Times New Roman", serif' },
    h3: { fontFamily: 'Georgia, "Times New Roman", serif' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 4, paddingInline: 16 },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { border: "1px solid #dce2db", backgroundImage: "none" },
      },
    },
  },
});

const NavItem = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = to === "/" ? pathname === to : pathname.startsWith(to);

  return (
    <Button
      component={Link}
      to={to}
      color="inherit"
      aria-current={active ? "page" : undefined}
      sx={{
        minWidth: 0,
        px: 1.25,
        borderRadius: 0,
        borderBottom: active ? "2px solid #e28b65" : "2px solid transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.78)",
        "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.09)" },
      }}
    >
      {children}
    </Button>
  );
};

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

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "#183b32", borderBottom: "3px solid #d47b5e" }}
        >
          <Container maxWidth="lg">
            <Toolbar
              disableGutters
              sx={{
                minHeight: { xs: 88, sm: 72 },
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: { xs: 0.5, sm: 2 },
              }}
            >
              <Typography
                component={Link}
                to="/"
                sx={{
                  color: "#fffefa",
                  fontFamily: 'Georgia, "Times New Roman", serif',
                  fontSize: 25,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  "&:hover": { color: "#e9b099" },
                }}
              >
                margin<span style={{ color: "#e28b65" }}>.</span>
              </Typography>
              <Box
                component="nav"
                aria-label="Main navigation"
                sx={{ display: "flex", alignItems: "center", gap: 0.25 }}
              >
                <NavItem to="/">blogs</NavItem>
                <NavItem to="/users">users</NavItem>
                {user ? <NavItem to="/create">new blog</NavItem> : null}
                {user ? (
                  <Button
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                      minWidth: 0,
                      px: 1.25,
                      color: "#f0b49d",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.09)" },
                    }}
                  >
                    logout
                  </Button>
                ) : (
                  <NavItem to="/login">login</NavItem>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Container maxWidth="lg">
          <Notification />
          <Box
            component="main"
            sx={{ py: { xs: 3, sm: 5 }, minHeight: "75vh" }}
          >
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
          </Box>
          <Box
            component="footer"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              py: 2,
              borderTop: "1px solid #dce2db",
              color: "text.secondary",
              fontSize: 12,
            }}
          >
            <span>margin. · Bloglist</span>
            <span>Write something worth keeping.</span>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default App;
