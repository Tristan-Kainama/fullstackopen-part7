import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import {
  useUsername,
  usePassword,
  useUserActions,
  useNotificationActions,
} from "../../store";

const LoginForm = () => {
  const username = useUsername();
  const password = usePassword();

  const { setUsername, setPassword, login } = useUserActions();
  const { setNotification } = useNotificationActions();

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login(username, password);

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

  const submitLogin = async (event) => {
    const loginSucceeded = await handleLogin(event);

    if (loginSucceeded) {
      navigate("/");
    }
  };

  return (
    <Box component="section" className="form-layout" sx={{ maxWidth: 460 }}>
      <p className="page-kicker">Welcome back</p>
      <Typography component="h1" className="page-heading">
        Sign in
      </Typography>
      <Box component="form" onSubmit={submitLogin} className="form-panel">
        <TextField
          label="username"
          name="username"
          size="small"
          fullWidth
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          label="password"
          name="password"
          type="password"
          size="small"
          fullWidth
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button type="submit" variant="contained" sx={{ justifySelf: "start" }}>
          login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginForm;
