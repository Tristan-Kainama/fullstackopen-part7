import { Link } from "react-router-dom";
import { useBlogs } from "../../store";
import { Box, Typography } from "@mui/material";

const BlogList = () => {
  const blogs = useBlogs();

  return (
    <Box component="section" sx={{ maxWidth: 820 }}>
      <p className="page-kicker">The collection</p>
      <Typography component="h1" className="page-heading">
        Recent posts
      </Typography>
      {blogs.length ? (
        <ul className="blog-list">
          {blogs.map((blog) => (
            <li className="blog-list-item" key={blog.id}>
              <Link className="blog-list-link" to={`/blogs/${blog.id}`}>
                <span className="blog-list-title">{blog.title}</span>
                <span className="blog-list-author">{blog.author}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Box className="empty-state">
          <Typography>No posts yet.</Typography>
        </Box>
      )}
    </Box>
  );
};

export default BlogList;
