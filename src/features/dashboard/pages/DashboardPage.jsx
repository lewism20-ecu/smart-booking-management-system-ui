import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { apiFetch } from "../../../api/apiClient";
import { getStoredUser } from "../../auth/utils/session";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";

const STATUS_COLORS = {
  approved: "success",
  pending: "warning",
  rejected: "error",
};

function formatDateTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// ──────────────────────────────────────────
// Shared stat card
// ──────────────────────────────────────────
function StatCard({ icon, label, value, color = "primary.main" }) {
  return (
    <Card
      elevation={0}
      sx={{ border: "1px solid", borderColor: "divider", borderRadius: "16px" }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: `${color}22`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1 }}>
              {value ?? "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
              {label}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ──────────────────────────────────────────
// Admin dashboard
// ──────────────────────────────────────────
function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/bookings"), apiFetch("/users")])
      .then(([bookingsData, usersData]) => {
        setBookings(bookingsData.bookings ?? []);
        setUsers(usersData.users ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );

  const pending = bookings.filter((b) => b.status === "pending").length;
  const approved = bookings.filter((b) => b.status === "approved").length;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        Admin Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CalendarTodayOutlinedIcon />}
            label="Total Bookings"
            value={bookings.length}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PendingOutlinedIcon />}
            label="Pending Approval"
            value={pending}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<CheckCircleOutlineIcon />}
            label="Approved"
            value={approved}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleOutlineIcon />}
            label="Registered Users"
            value={users.length}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography sx={{ p: 2.5, pb: 1.5, fontWeight: 600 }}>
            Recent Bookings
          </Typography>
          {bookings.length === 0 ? (
            <EmptyState
              title="No Bookings"
              description="There are currently no bookings in the system."
            />
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
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
                    <TableCell>Resource</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.slice(0, 10).map((b) => (
                    <TableRow key={b.booking_id} hover>
                      <TableCell>{b.resource_name}</TableCell>
                      <TableCell>{b.venue_id}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(b.start_time)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(b.end_time)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={b.status}
                          size="small"
                          color={STATUS_COLORS[b.status] ?? "default"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// ──────────────────────────────────────────
// Manager dashboard
// ──────────────────────────────────────────
function ManagerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getStoredUser();

  useEffect(() => {
    apiFetch("/bookings")
      .then((data) => setBookings(data.bookings ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );

  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Manager Dashboard
      </Typography>
      {user?.managedVenues?.length > 0 && (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Managing: {user.managedVenues.join(", ")}
        </Typography>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<CalendarTodayOutlinedIcon />}
            label="Total Bookings"
            value={bookings.length}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<PendingOutlinedIcon />}
            label="Pending Approval"
            value={pending.length}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<BusinessOutlinedIcon />}
            label="Managed Venues"
            value={user?.managedVenues?.length ?? 0}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography sx={{ p: 2.5, pb: 1.5, fontWeight: 600 }}>
            Pending Approvals
          </Typography>
          {pending.length === 0 ? (
            <EmptyState
              title="No Pending Bookings"
              description="You have no pending bookings to review."
            />
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
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
                    <TableCell>Resource</TableCell>
                    <TableCell>Venue</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pending.map((b) => (
                    <TableRow key={b.booking_id} hover>
                      <TableCell>{b.resource_name}</TableCell>
                      <TableCell>{b.venue_id}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(b.start_time)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(b.end_time)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// ──────────────────────────────────────────
// User dashboard
// ──────────────────────────────────────────
function UserDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/bookings")
      .then((data) => setBookings(data.bookings ?? []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <Typography color="error" sx={{ mt: 4, textAlign: "center" }}>
        {error}
      </Typography>
    );

  const now = new Date();
  const upcoming = bookings
    .filter((b) => b.status !== "rejected" && new Date(b.start_time) > now)
    .sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
  const next = upcoming[0];

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
        My Dashboard
      </Typography>

      {next && (
        <Card
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid",
            borderColor: "primary.main",
            borderRadius: "16px",
            background: (t) =>
              t.palette.mode === "dark"
                ? "linear-gradient(135deg, #1a2340 0%, #1a1d2e 100%)"
                : "linear-gradient(135deg, #eef3ff 0%, #f6f0ff 100%)",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ fontWeight: 700 }}
            >
              Next Booking
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
              {next.resource_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDateTime(next.start_time)} →{" "}
              {formatDateTime(next.end_time)}
            </Typography>
            <Chip
              label={next.status}
              size="small"
              color={STATUS_COLORS[next.status] ?? "default"}
              sx={{ mt: 1 }}
            />
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<CalendarTodayOutlinedIcon />}
            label="Total Bookings"
            value={bookings.length}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<CheckCircleOutlineIcon />}
            label="Approved"
            value={bookings.filter((b) => b.status === "approved").length}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            icon={<PendingOutlinedIcon />}
            label="Pending"
            value={bookings.filter((b) => b.status === "pending").length}
            color="warning.main"
          />
        </Grid>
      </Grid>

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "16px",
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Typography sx={{ p: 2.5, pb: 1.5, fontWeight: 600 }}>
            My Bookings
          </Typography>
          {bookings.length === 0 ? (
            <EmptyState
              title="No Bookings Yet"
              description="Browse venues to make your first booking."
            />
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
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
                    <TableCell>Resource</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((b) => (
                    <TableRow key={b.booking_id} hover>
                      <TableCell>{b.resource_name}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(b.start_time)}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(b.end_time)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={b.status}
                          size="small"
                          color={STATUS_COLORS[b.status] ?? "default"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

// ──────────────────────────────────────────
// Root — dispatch by role
// ──────────────────────────────────────────
export default function DashboardPage() {
  const user = getStoredUser();

  if (user?.role === "admin") return <AdminDashboard />;
  if (user?.role === "manager") return <ManagerDashboard />;
  return <UserDashboard />;
}
