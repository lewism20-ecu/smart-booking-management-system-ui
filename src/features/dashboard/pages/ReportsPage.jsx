import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { apiFetch } from "../../../api/apiClient";

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

function ProgressBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {value} ({pct}%)
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={pct}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
}

export default function ReportsPage() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch("/bookings"),
      apiFetch("/users"),
      apiFetch("/resources"),
    ])
      .then(([b, u, r]) => {
        setBookings(b.bookings ?? []);
        setUsers(u.users ?? []);
        setResources(r.resources ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Generating reports..." />;

  const approved = bookings.filter((b) => b.status === "approved").length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const rejected = bookings.filter((b) => b.status === "rejected").length;

  // Bookings per resource (top 5)
  const resourceCounts = bookings.reduce((acc, b) => {
    acc[b.resource_name] = (acc[b.resource_name] ?? 0) + 1;
    return acc;
  }, {});
  const topResources = Object.entries(resourceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <BarChartOutlinedIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Reports
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<CalendarTodayOutlinedIcon />}
            label="Total Bookings"
            value={bookings.length}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<CheckCircleOutlineIcon />}
            label="Approved"
            value={approved}
            color="success.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<PendingOutlinedIcon />}
            label="Pending"
            value={pending}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<CancelOutlinedIcon />}
            label="Rejected"
            value={rejected}
            color="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <StatCard
            icon={<PeopleOutlineIcon />}
            label="Users"
            value={users.length}
            color="secondary.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Booking status breakdown */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                Booking Status Breakdown
              </Typography>
              <ProgressBar
                label="Approved"
                value={approved}
                max={bookings.length}
                color="success"
              />
              <ProgressBar
                label="Pending"
                value={pending}
                max={bookings.length}
                color="warning"
              />
              <ProgressBar
                label="Rejected"
                value={rejected}
                max={bookings.length}
                color="error"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Top resources */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <BusinessOutlinedIcon
                  sx={{ fontSize: 20, color: "text.secondary" }}
                />
                <Typography sx={{ fontWeight: 600 }}>
                  Most Booked Resources
                </Typography>
              </Stack>
              {topResources.length === 0 ? (
                <Typography color="text.secondary">No data yet.</Typography>
              ) : (
                topResources.map(([name, count]) => (
                  <ProgressBar
                    key={name}
                    label={name}
                    value={count}
                    max={bookings.length}
                    color="primary"
                  />
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Role distribution */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                User Role Distribution
              </Typography>
              {["admin", "manager", "user"].map((role) => {
                const count = users.filter((u) => u.role === role).length;
                return (
                  <ProgressBar
                    key={role}
                    label={role.charAt(0).toUpperCase() + role.slice(1)}
                    value={count}
                    max={users.length}
                    color={
                      role === "admin"
                        ? "error"
                        : role === "manager"
                          ? "warning"
                          : "primary"
                    }
                  />
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Resource type split */}
        <Grid item xs={12} md={6}>
          <Card
            elevation={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "16px",
            }}
          >
            <CardContent>
              <Typography sx={{ fontWeight: 600, mb: 2 }}>
                Resource Type Split
              </Typography>
              {["desk", "room"].map((type) => {
                const count = resources.filter((r) => r.type === type).length;
                return (
                  <ProgressBar
                    key={type}
                    label={type.charAt(0).toUpperCase() + type.slice(1)}
                    value={count}
                    max={resources.length}
                    color="secondary"
                  />
                );
              })}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
