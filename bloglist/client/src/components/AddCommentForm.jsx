import { Box, TextField, Button } from "@mui/material";
import {
  useBlogActions,
  useComment,
  useNotificationActions,
  useUser,
} from "../store";

const AddCommentForm = ({ blog }) => {
  const comment = useComment();
  const commentValue = typeof comment === "string" ? comment : "";
  const user = useUser();
  const { addNewComment, setComment } = useBlogActions();
  const { setNotification } = useNotificationActions();

  const addComment = async (e) => {
    e.preventDefault();

    const trimmedComment = commentValue.trim();
    if (!trimmedComment) return;

    try {
      await addNewComment(blog.id, { comment: trimmedComment });
      setComment("");
      setNotification({
        text: "Successfully added comment!",
        type: "success",
      });
      setTimout(() => setNotification(null), 5000);
    } catch (error) {
      setNotification({
        text:
          error.response?.data?.error ||
          "Could not add comment. Please try again.",
        type: "error",
      });
      setTimeout(() => setNotification(null), 5000);
    }
  };

  if (!user) return null;

  return (
    <div>
      <Box
        component="form"
        onSubmit={addComment}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "7px",
          width: "100%",
          maxWidth: 560,
        }}
      >
        <TextField
          label="add a comment"
          name="comment"
          id="comment"
          size="small"
          value={commentValue}
          onChange={({ target }) => setComment(target.value)}
          sx={{ flex: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ height: 40, minHeight: 40, flexShrink: 0 }}
        >
          ADD COMMENT
        </Button>
      </Box>
    </div>
  );
};

export default AddCommentForm;
