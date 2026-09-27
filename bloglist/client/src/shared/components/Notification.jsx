import { Alert } from "@mui/material";
import { useNotification } from "../../store";

const Notification = () => {
  const notification = useNotification();

  if (notification === null) {
    return null;
  }

  return (
    <Alert
      severity={notification.type}
      sx={{
        mt: 2,
        border: "1px solid",
        borderColor: `${notification.type}.main`,
        borderRadius: 1,
        boxShadow: "0 4px 14px rgb(30 41 38 / 6%)",
      }}
    >
      {notification.text}
    </Alert>
  );
};

export default Notification;
