import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router";
import { login } from "../api/authClient";

const defaultForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const [formValues, setFormValues] = useState(defaultForm);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [authResult, setAuthResult] = useState(null);

  const onChangeField = (event) => {
    const { name, value } = event.target;
    setFormValues((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setAuthResult(null);
    setIsSubmitting(true);

    try {
      const data = await login({
        email: formValues.email,
        password: formValues.password,
      });

      sessionStorage.removeItem("sbms.token");
      sessionStorage.removeItem("sbms.user");
      localStorage.removeItem("sbms.token");
      localStorage.removeItem("sbms.user");

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem("sbms.token", data.token);
      storage.setItem("sbms.user", JSON.stringify(data.user));
      setAuthResult(data);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        py: { xs: 4, sm: 6 },
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={3}
        sx={{ width: "100%", textAlign: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            width: 62,
            height: 62,
            mx: "auto",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #2763f4 0%, #9131f5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            boxShadow: "0 12px 24px rgba(68, 74, 199, 0.25)",
          }}
        >
          <BusinessOutlinedIcon sx={{ fontSize: 30 }} />
        </Box>

        <Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontSize: { xs: 34, sm: 44 }, fontWeight: 700 }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Sign in to your booking management account
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 640,
            border: "1px solid #d9dde6",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(26, 35, 64, 0.08)",
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Box component="form" onSubmit={onSubmit} noValidate>
              <Stack spacing={2}>
                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.8,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 500,
                    }}
                  >
                    <MailOutlineIcon sx={{ fontSize: 18, color: "#3b82f6" }} />{" "}
                    Email Address
                  </Typography>
                  <TextField
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                    value={formValues.email}
                    onChange={onChangeField}
                    required
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f4f5f8",
                      },
                    }}
                  />
                </Box>

                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 0.8,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      fontWeight: 500,
                    }}
                  >
                    <LockOutlinedIcon sx={{ fontSize: 18, color: "#3b82f6" }} />{" "}
                    Password
                  </Typography>
                  <TextField
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={formValues.password}
                    onChange={onChangeField}
                    required
                    fullWidth
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#f4f5f8",
                      },
                    }}
                  />
                </Box>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={rememberMe}
                        onChange={(event) =>
                          setRememberMe(event.target.checked)
                        }
                      />
                    }
                    label={<Typography variant="body2">Remember me</Typography>}
                  />
                  <Link href="#" underline="hover" sx={{ fontSize: 14 }}>
                    Forgot password?
                  </Link>
                </Stack>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  endIcon={!isSubmitting ? <ArrowForwardIcon /> : null}
                  sx={{
                    mt: 1,
                    py: 1.2,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontSize: 20,
                    fontWeight: 600,
                    background:
                      "linear-gradient(90deg, #2e62eb 0%, #8e2de2 100%)",
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </Stack>
            </Box>

            {errorMessage ? (
              <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
                {errorMessage}
              </Alert>
            ) : null}

            {authResult ? (
              <Alert severity="success" sx={{ mt: 2, textAlign: "left" }}>
                Logged in as {authResult.user.email} ({authResult.user.role})
              </Alert>
            ) : null}

            <Typography variant="body1" sx={{ mt: 3 }}>
              Don&apos;t have an account?{" "}
              <Link
                component={RouterLink}
                to="/signup"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Sign up
              </Link>
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="body2" color="text.secondary">
          &copy; 2026 Smart Booking System. All rights reserved.
        </Typography>
      </Stack>
    </Container>
  );
}
