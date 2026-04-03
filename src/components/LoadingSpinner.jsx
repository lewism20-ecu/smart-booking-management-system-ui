import { Box, CircularProgress, Typography, Fade } from "@mui/material";

export default function LoadingSpinner({
  message = "Loading...",
  minHeight = "50vh",
}) {
  return (
    <Fade in={true} style={{ transitionDelay: "400ms" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight,
          gap: 2,
        }}
      >
        <CircularProgress size={40} thickness={4} />
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
}
