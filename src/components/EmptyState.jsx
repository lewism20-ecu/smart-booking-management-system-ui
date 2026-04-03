import { Box, Typography } from "@mui/material";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

export default function EmptyState({
  icon,
  title,
  description,
  minHeight = 240,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight,
        textAlign: "center",
        p: 4,
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          color: "text.disabled",
          display: "flex",
          "& > svg": { fontSize: 48 },
        }}
      >
        {icon || <InboxOutlinedIcon />}
      </Box>
      <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
        {title}
      </Typography>
      {description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  );
}
