import { useEffect, useState } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { apiFetch } from "../../../api/apiClient";

function SpaceDetailsModal({ resource, open, onClose, onBook }) {
  if (!resource) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {resource.name} Details
      </DialogTitle>
      <DialogContent>
        <Typography
          variant="h6"
          sx={{ mt: 1, mb: 1, fontSize: "1rem", fontWeight: 600 }}
        >
          Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Type:{" "}
          <b style={{ textTransform: "capitalize" }}>
            {resource.resource_type}
          </b>
          <br />
          Capacity: <b>{resource.capacity} people</b>
        </Typography>

        <Typography
          variant="h6"
          sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
        >
          Amenities & Features
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {resource.tags &&
            Array.isArray(resource.tags) &&
            resource.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          {(!resource.tags || resource.tags.length === 0) && (
            <Typography variant="body2" color="text.secondary">
              No special amenities listed.
            </Typography>
          )}
        </Box>

        <Typography
          variant="h6"
          sx={{ fontSize: "1rem", fontWeight: 600, mb: 1 }}
        >
          Booking Information
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {resource.approval_required
            ? "Requires manager approval before the booking is confirmed."
            : "This space supports instant booking."}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            onClose();
            onBook(resource);
          }}
          sx={{ textTransform: "none", borderRadius: "8px" }}
        >
          Book Resource
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function BookingModal({ resource, open, onClose, onSuccess }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiFetch("/bookings", {
        method: "POST",
        body: JSON.stringify({
          resourceId: resource.resource_id,
          startTime: new Date(start).toISOString(),
          endTime: new Date(end).toISOString(),
        }),
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!resource) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: "16px" } }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Book {resource.name}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Capacity: {resource.capacity} people | Type:{" "}
            {resource.resource_type}
            <br />
            {resource.approval_required
              ? "Requires manager approval."
              : "Instant booking."}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={3}>
            <TextField
              label="Start Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
            <TextField
              label="End Time"
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
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !start || !end}
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default function BrowseVenuesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingTarget, setBookingTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    apiFetch("/resources")
      .then((data) =>
        setResources(data.resources ?? (Array.isArray(data) ? data : [])),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleBookingSuccess = () => {
    setBookingTarget(null);
    setSuccessMsg("Booking created successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <MeetingRoomOutlinedIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Browse Spaces
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner text="Loading available spaces..." />
      ) : resources.length === 0 ? (
        <EmptyState
          title="No Spaces Available"
          description="There are currently no resources or spaces listed in the system."
        />
      ) : (
        <Grid container spacing={3}>
          {resources.map((resource) => (
            <Grid item xs={12} sm={6} md={4} key={resource.resource_id}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "16px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "box-shadow 200ms",
                  "&:hover": {
                    boxShadow: (t) =>
                      t.palette.mode === "dark"
                        ? "0 8px 24px rgba(0,0,0,0.4)"
                        : "0 8px 24px rgba(26,35,64,0.12)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {resource.name}
                  </Typography>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mb: 1 }}
                  >
                    <EventAvailableOutlinedIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textTransform: "capitalize" }}
                    >
                      {resource.resource_type}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.5}
                    sx={{ mb: 1.5 }}
                  >
                    <PeopleOutlineIcon
                      sx={{ fontSize: 16, color: "text.secondary" }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Capacity: {resource.capacity} people
                    </Typography>
                  </Stack>

                  <Box
                    sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    <Chip
                      label={
                        resource.approval_required
                          ? "Approval required"
                          : "Instant booking"
                      }
                      size="small"
                      color={resource.approval_required ? "warning" : "success"}
                      variant="outlined"
                    />
                    {resource.tags &&
                      Array.isArray(resource.tags) &&
                      resource.tags.map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2.5, pt: 0, gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                    onClick={() => setViewTarget(resource)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                    onClick={() => setBookingTarget(resource)}
                  >
                    Book
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <BookingModal
        resource={bookingTarget}
        open={Boolean(bookingTarget)}
        onClose={() => setBookingTarget(null)}
        onSuccess={handleBookingSuccess}
      />
      <SpaceDetailsModal
        resource={viewTarget}
        open={Boolean(viewTarget)}
        onClose={() => setViewTarget(null)}
        onBook={(resource) => setBookingTarget(resource)}
      />
    </Box>
  );
}
