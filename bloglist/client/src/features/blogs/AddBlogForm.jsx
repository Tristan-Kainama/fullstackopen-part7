import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography } from "@mui/material";
import {
  useNotificationActions,
  useNewBlog,
  useBlogActions,
} from "../../store";

const AddBlogForm = () => {
  const { setNotification } = useNotificationActions();

  const newBlog = useNewBlog();
  const { setNewBlog, add } = useBlogActions();

  const navigate = useNavigate();

  const createBlog = async (newBlog) => {
    try {
      const createdBlog = {
        title: newBlog.title,
        author: newBlog.author,
        url: newBlog.url,
        likes: 0,
      };

      add(createdBlog);

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

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    });

    setNewBlog({
      title: "",
      author: "",
      url: "",
    });

    navigate("/");
  };

  return (
    <Box component="section" className="form-layout">
      <p className="page-kicker">Contribute</p>
      <Typography component="h1" className="page-heading">
        Create a post
      </Typography>
      <Box component="form" onSubmit={addBlog} className="form-panel">
        <TextField
          label="title"
          name="title"
          id="title"
          size="small"
          fullWidth
          value={newBlog.title}
          onChange={({ target }) =>
            setNewBlog((prev) => ({
              ...prev,
              [target.name]: target.value,
            }))
          }
        />
        <TextField
          label="author"
          name="author"
          id="author"
          size="small"
          fullWidth
          value={newBlog.author}
          onChange={({ target }) =>
            setNewBlog((prev) => ({
              ...prev,
              [target.name]: target.value,
            }))
          }
        />
        <TextField
          label="url"
          name="url"
          id="url"
          size="small"
          fullWidth
          value={newBlog.url}
          onChange={({ target }) =>
            setNewBlog((prev) => ({
              ...prev,
              [target.name]: target.value,
            }))
          }
        />
        <Button type="submit" variant="contained" sx={{ justifySelf: "start" }}>
          create
        </Button>
      </Box>
    </Box>
  );
};

export default AddBlogForm;
