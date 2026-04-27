import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import { apiFetch } from "../../../api/apiClient";

const ROLE_COLORS = {
  admin: "error",
  manager: "warning",
  user: "default",
};

function userInitials(email) {
  return email ? email.slice(0, 2).toUpperCase() : "?";
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/users")
      .then((data) => setUsers(Array.isArray(data) ? data : (data.users ?? [])))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <PeopleOutlineIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Users
        </Typography>
        {!loading && (
          <Chip
            label={`${users.length} total`}
            size="small"
            variant="outlined"
          />
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner text="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          title="No Users Found"
          description="There are currently no registered users."
        />
      ) : (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: "16px",
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow
                    sx={{
                      "& th": {
                        fontWeight: 600,
                        borderBottom: "2px solid",
                        borderColor: "divider",
                      },
                    }}
                  >
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Managed Venues</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.userId} hover>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              fontSize: 12,
                              fontWeight: 700,
                              background:
                                "linear-gradient(135deg, #2763f4 0%, #9131f5 100%)",
                            }}
                          >
                            {userInitials(u.email)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {u.email.split("@")[0]}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {u.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.role}
                          size="small"
                          color={ROLE_COLORS[u.role] ?? "default"}
                        />
                      </TableCell>
                      <TableCell>
                        {u.managedVenues?.length > 0 ? (
                          u.managedVenues.join(", ")
                        ) : (
                          <Typography variant="body2" color="text.disabled">
                            —
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
