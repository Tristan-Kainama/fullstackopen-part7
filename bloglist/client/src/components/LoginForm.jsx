import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import {
  useUsername,
  usePassword,
  useUserActions,
  useNotificationActions,
} from "../store";

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
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={submitLogin}>
        <div>
          <TextField
            label="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />

          <br />

          <TextField
            label="password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            style={{ marginTop: 10 }}
          />
        </div>

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
