import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { useNotificationActions, useNewBlog, useBlogActions } from "../store";

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
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <TextField
          label="title"
          name="title"
          id="title"
          value={newBlog.title}
          onChange={({ target }) =>
            setNewBlog((prev) => ({
              ...prev,
              [target.name]: target.value,
            }))
          }
          style={{ marginTop: 10 }}
        />

        <br />

        <TextField
          label="author"
          name="author"
          id="author"
          value={newBlog.author}
          onChange={({ target }) =>
            setNewBlog((prev) => ({
              ...prev,
              [target.name]: target.value,
            }))
          }
          style={{ marginTop: 10 }}
        />

        <br />

        <TextField
          label="url"
          name="url"
          id="url"
          value={newBlog.url}
          onChange={({ target }) =>
            setNewBlog((prev) => ({
              ...prev,
              [target.name]: target.value,
            }))
          }
          style={{ marginTop: 10 }}
        />

        <br />

        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  );
};

export default AddBlogForm;
