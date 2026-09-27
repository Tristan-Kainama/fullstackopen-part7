import { Link, useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { useUsers } from "../../store";

const User = () => {
  const users = useUsers();
  const id = useParams().id;
  const user = users.find((user) => user.id === id);

  if (!user) {
    return (
      <Box className="empty-state" sx={{ maxWidth: 620 }}>
        {users.length === 0 ? "Loading member profile..." : "Member not found."}
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ maxWidth: 820 }}>
      <p className="page-kicker">Member profile</p>
      <Typography component="h1" className="page-heading">
        {user.name}
      </Typography>
      <Typography sx={{ color: "text.secondary", mb: 3 }}>
        @{user.username} · {user.blogs.length}{" "}
        {user.blogs.length === 1 ? "post" : "posts"}
      </Typography>
      <Typography component="h2" className="page-heading" sx={{ fontSize: 24 }}>
        Published posts
      </Typography>
      {user.blogs.length ? (
        <ul className="blog-list user-blog-list">
          {user.blogs.map((blog) => (
            <li className="blog-list-item" key={blog.id}>
              <Link className="blog-list-link" to={`/blogs/${blog.id}`}>
                <span className="blog-list-title">{blog.title}</span>
                <span className="blog-list-author">Read post</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Box className="empty-state">No posts published yet.</Box>
      )}
    </Box>
  );
};

export default User;
