import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  Typography,
  Button,
} from "@mui/material";

import {
  useBlogs,
  useBlogActions,
  useNotificationActions,
  useUser,
  useUsers,
} from "../store";
import blogService from "../services/blogs";

const Blog = () => {
  const blogs = useBlogs();
  const user = useUser();
  const users = useUsers();

  const { update, remove } = useBlogActions();
  const { setNotification } = useNotificationActions();

  const navigate = useNavigate();

  const curUser = user
    ? users.find((thisUser) => thisUser.username === user.username)
    : null;

  const id = useParams().id;
  const blog = blogs.find((blog) => blog.id === id);

  const updateBlog = async (newBlog, blogId) => {
    if (user === null) {
      setNotification({ text: "User has to be logged in!", type: "error" });

      setTimeout(() => {
        setNotification(null);
      }, 5000);
      return;
    }

    try {
      update(newBlog, blogId);
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
      remove(blogId);

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

  const handleLike = (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    updateBlog(
      {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
      },
      blog.id,
    );
  };

  const handleRemove = (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      removeBlog(blog.id);
      navigate("/");
    }
  };

  const isOwner = curUser && curUser.id === blog.user.id;

  return (
    <Card id={blog.id}>
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h5" component="div">
          {blog.title}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1 }}>
          by {blog.author}
        </Typography>
        <Typography
          component="a"
          href={blog.url}
          sx={{ mb: 1, display: "block" }}
        >
          {blog.url}
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Added by {blog.user.name}
        </Typography>
      </CardContent>
      <CardActions sx={{ pl: 2 }}>
        <Typography>{blog.likes} likes</Typography>
        {user ? (
          <Button onClick={handleLike} variant="outlined">
            like
          </Button>
        ) : null}
        {isOwner ? (
          <Button onClick={handleRemove} variant="outlined" color="error">
            remove
          </Button>
        ) : null}
      </CardActions>
    </Card>
  );
};

export default Blog;
