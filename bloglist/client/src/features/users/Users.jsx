import { useUsers } from "../../store";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const Users = () => {
  const users = useUsers();

  return (
    <Box component="section">
      <p className="page-kicker">Community</p>
      <Typography component="h1" className="page-heading">
        Members
      </Typography>
      <TableContainer component={Paper} className="users-table-wrap">
        <Table>
          <TableHead sx={{ bgcolor: "#e9eee8" }}>
            <TableRow>
              <TableCell sx={{ color: "text.secondary", fontWeight: 800 }}>
                Name
              </TableCell>
              <TableCell sx={{ color: "text.secondary", fontWeight: 800 }}>
                Username
              </TableCell>
              <TableCell
                align="right"
                sx={{ color: "text.secondary", fontWeight: 800 }}
              >
                Posts
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow hover key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`} style={{ fontWeight: 700 }}>
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  @{user.username}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {user.blogs.length}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Users;
