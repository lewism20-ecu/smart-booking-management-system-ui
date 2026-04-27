import { useEffect, useState, useCallback } from "react";
import LoadingSpinner from "../../../components/LoadingSpinner";
import EmptyState from "../../../components/EmptyState";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { apiFetch } from "../../../api/apiClient";

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

export default function ApprovalsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [actingId, setActingId] = useState(null);

  const fetchBookings = useCallback(() => {
    setLoading(true);
    apiFetch("/bookings")
      .then((data) =>
        setBookings(Array.isArray(data) ? data : (data.bookings ?? [])),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleAction = async (bookingId, action) => {
    setActingId(bookingId);
    setActionError("");
    try {
      await apiFetch(`/bookings/${bookingId}/${action}`, { method: "POST" });
      setBookings((prev) =>
        prev.map((b) =>
          b.booking_id === bookingId
            ? { ...b, status: action === "approve" ? "approved" : "rejected" }
            : b,
        ),
      );
    } catch (e) {
      setActionError(e.message);
    } finally {
      setActingId(null);
    }
  };

  const tabStatuses = ["pending", "approved", "rejected"];
  const filtered = bookings.filter((b) => b.status === tabStatuses[activeTab]);

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
        <CheckCircleOutlineIcon color="primary" />
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Approvals
        </Typography>
      </Stack>

      {(error || actionError) && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => {
            setError("");
            setActionError("");
          }}
        >
          {error || actionError}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 2, borderBottom: "1px solid", borderColor: "divider" }}
      >
        <Tab
          label={`Pending (${bookings.filter((b) => b.status === "pending").length})`}
        />
        <Tab label="Approved" />
        <Tab label="Rejected" />
      </Tabs>

      {loading ? (
        <LoadingSpinner text="Fetching approvals..." />
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
            {filtered.length === 0 ? (
              <EmptyState
                title={`No ${tabStatuses[activeTab]} approvals`}
                description={`There are currently no bookings with a ${tabStatuses[activeTab]} status.`}
                sx={{ p: 4 }}
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
                      {activeTab === 0 && (
                        <TableCell align="right">Actions</TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filtered.map((b) => (
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
                        {activeTab === 0 && (
                          <TableCell align="right">
                            <Stack
                              direction="row"
                              spacing={1}
                              justifyContent="flex-end"
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                disabled={actingId === b.booking_id}
                                onClick={() =>
                                  handleAction(b.booking_id, "approve")
                                }
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "8px",
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                disabled={actingId === b.booking_id}
                                onClick={() =>
                                  handleAction(b.booking_id, "reject")
                                }
                                sx={{
                                  textTransform: "none",
                                  borderRadius: "8px",
                                }}
                              >
                                Reject
                              </Button>
                            </Stack>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
