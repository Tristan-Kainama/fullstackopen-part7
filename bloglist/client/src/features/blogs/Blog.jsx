import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

import {
  useBlogs,
  useBlogActions,
  useNotificationActions,
  useUser,
  useUsers,
} from "../../store";
import blogService from "../../services/blogs";

import AddCommentForm from "./AddCommentForm";

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
    <Box component="article" className="blog-detail" id={blog.id}>
      <header className="blog-detail-header">
        <p className="page-kicker">Filed under stories</p>
        <Typography component="h1" className="page-heading">
          {blog.title}
        </Typography>
        <p className="blog-detail-byline">
          Written by <strong>{blog.author}</strong>
          {blog.user?.name ? ` · Added by ${blog.user.name}` : null}
        </p>
        <div className="blog-detail-actions">
          <Typography className="blog-like-count">
            {blog.likes} {blog.likes === 1 ? "like" : "likes"}
          </Typography>
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
        </div>
      </header>

      <Box className="blog-detail-body">
        <Typography
          className="blog-url"
          component="a"
          href={blog.url}
          target="_blank"
          rel="noreferrer"
        >
          {blog.url}
        </Typography>
      </Box>

      <section className="blog-comments" aria-labelledby="comments-heading">
        <div className="blog-comments-heading">
          <Typography component="h2" id="comments-heading">
            Comments
          </Typography>
          <span className="blog-comments-count">{blog.comments.length}</span>
        </div>
        <AddCommentForm blog={blog} />
        <ul className="comment-list">
          {blog.comments.map((comment, index) => (
            <li key={`${blog.id}-${index}`}>{comment}</li>
          ))}
        </ul>
      </section>
    </Box>
  );
};

export default Blog;
