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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { apiFetch } from "../../../api/apiClient";
import { getStoredUser } from "../../auth/utils/session";

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    type: "desk",
    capacity: 1,
    venue_id: "",
    approval_required: false,
  });
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";

  const fetchResources = useCallback(() => {
    setLoading(true);
    apiFetch("/resources")
      .then((data) =>
        setResources(Array.isArray(data) ? data : (data.resources ?? [])),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const body = {
        name: formValues.name,
        type: formValues.type,
        capacity: Number(formValues.capacity),
        venue_id: Number(formValues.venue_id),
        approval_required: formValues.approval_required,
      };
      await apiFetch("/resources", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setDialogOpen(false);
      setFormValues({
        name: "",
        type: "desk",
        capacity: 1,
        venue_id: "",
        approval_required: false,
      });
      fetchResources();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <MeetingRoomOutlinedIcon color="primary" />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Resources
          </Typography>
        </Stack>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{ textTransform: "none", borderRadius: "10px" }}
          >
            Add Resource
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LoadingSpinner text="Fetching resources..." />
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
            {resources.length === 0 ? (
              <EmptyState
                title="No Resources Found"
                description="There are currently no resources available."
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
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Capacity</TableCell>
                      <TableCell>Venue</TableCell>
                      <TableCell>Approval</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resources.map((r) => (
                      <TableRow key={r.resource_id} hover>
                        <TableCell>{r.name}</TableCell>
                        <TableCell>
                          <Chip
                            label={r.type}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{r.capacity}</TableCell>
                        <TableCell>{r.venue_name ?? r.venue_id}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              r.approval_required ? "Required" : "Not required"
                            }
                            size="small"
                            color={r.approval_required ? "warning" : "success"}
                            variant="outlined"
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
      )}

      {/* Add resource dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !saving && setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: "16px" } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>Add Resource</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            pt: "16px !important",
          }}
        >
          <TextField
            label="Name"
            value={formValues.name}
            onChange={(e) =>
              setFormValues((p) => ({ ...p, name: e.target.value }))
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={formValues.type}
              onChange={(e) =>
                setFormValues((p) => ({ ...p, type: e.target.value }))
              }
            >
              <MenuItem value="desk">Desk</MenuItem>
              <MenuItem value="room">Room</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Capacity"
            type="number"
            value={formValues.capacity}
            onChange={(e) =>
              setFormValues((p) => ({ ...p, capacity: e.target.value }))
            }
            fullWidth
            inputProps={{ min: 1 }}
          />
          <TextField
            label="Venue ID"
            type="number"
            value={formValues.venue_id}
            onChange={(e) =>
              setFormValues((p) => ({ ...p, venue_id: e.target.value }))
            }
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Approval Required</InputLabel>
            <Select
              label="Approval Required"
              value={formValues.approval_required}
              onChange={(e) =>
                setFormValues((p) => ({
                  ...p,
                  approval_required: e.target.value,
                }))
              }
            >
              <MenuItem value={false}>No</MenuItem>
              <MenuItem value={true}>Yes</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            disabled={saving}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !formValues.name || !formValues.venue_id}
            variant="contained"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
