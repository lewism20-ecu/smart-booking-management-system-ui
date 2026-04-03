import { useEffect, useState, useCallback } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import { apiFetch } from "../../../api/apiClient";
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

function RescheduleDialog({ booking, open, onClose, onSuccess }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill existing times
  useEffect(() => {
    if (booking) {
      // slice(0,16) strips seconds and Z off ISO string so it works with datetime-local
      setStart(new Date(booking.start_time).toISOString().slice(0, 16));
      setEnd(new Date(booking.end_time).toISOString().slice(0, 16));
    }
  }, [booking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const updated = await apiFetch(`/bookings/${booking.booking_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          startTime: new Date(start).toISOString(),
          endTime: new Date(end).toISOString(),
        }),
      });
      onSuccess(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: "16px" } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>
        Reschedule: {booking.resource_name}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Current status: <Chip label={booking.status} size="small" color={STATUS_COLORS[booking.status] ?? "default"} />
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              label="New Start Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
            <TextField
              label="New End Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading || !start || !end} sx={{ textTransform: "none", borderRadius: "8px" }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    apiFetch("/bookings")
      .then((data) => setBookings(data.bookings ?? (Array.isArray(data) ? data : [])))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      await apiFetch(`/bookings/${cancelTarget.booking_id}`, {
        method: "DELETE",
      });
      setBookings((prev) =>
        prev.filter((b) => b.booking_id !== cancelTarget.booking_id),
      );
      setCancelTarget(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleSuccess = (updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (b.booking_id === updatedBooking.booking_id ? { ...b, ...updatedBooking } : b))
    );
    setRescheduleTarget(null);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <CalendarTodayOutlinedIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          My Bookings
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner minHeight="40vh" />
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
            {bookings.length === 0 ? (
              <EmptyState
                icon={<CalendarTodayOutlinedIcon sx={{ fontSize: 48 }} />}
                title="No bookings found"
                description="You haven't made any bookings yet. Browse spaces to book a resource."
              />
            ) : (
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
                      <TableCell>Resource</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>End</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {bookings.map((b) => {
                      const isPast = new Date(b.end_time) < new Date();
                      return (
                        <TableRow key={b.booking_id} hover>
                          <TableCell>{b.resource_name}</TableCell>
                          <TableCell>{b.venue_name ?? b.venue_id}</TableCell>
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
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              {!isPast && b.status !== "rejected" && (
                                <>
                                  <Button
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                    onClick={() => setRescheduleTarget(b)}
                                    sx={{ textTransform: "none", borderRadius: "8px" }}
                                  >
                                    Reschedule
                                  </Button>
                                  <Button
                                    size="small"
                                    color="error"
                                    variant="outlined"
                                    onClick={() => setCancelTarget(b)}
                                    sx={{ textTransform: "none", borderRadius: "8px" }}
                                  >
                                    Cancel
                                  </Button>
                                </>
                              )}
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>
      )}

      {/* Cancel confirmation dialog */}
      <Dialog
        open={Boolean(cancelTarget)}
        onClose={() => !cancelling && setCancelTarget(null)}
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Cancel Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Cancel <strong>{cancelTarget?.resource_name}</strong> on{" "}
            {cancelTarget ? formatDateTime(cancelTarget.start_time) : ""}? This
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setCancelTarget(null)}
            disabled={cancelling}
            sx={{ textTransform: "none" }}
          >
            Keep it
          </Button>
          <Button
            onClick={handleCancelConfirm}
            disabled={cancelling}
            color="error"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            {cancelling ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              "Yes, cancel"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <RescheduleDialog
        booking={rescheduleTarget}
        open={Boolean(rescheduleTarget)}
        onClose={() => setRescheduleTarget(null)}
        onSuccess={handleRescheduleSuccess}
      />
    </Box>
  );
}
