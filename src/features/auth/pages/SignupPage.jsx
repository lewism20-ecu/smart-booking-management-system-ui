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
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router";
import { signup } from "../api/authClient";
import { useColorMode } from "../../../app/ColorModeContext";
import LegalModal from "../../../components/LegalModal";

const defaultForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function SignupPage() {
  const { mode, toggleColorMode } = useColorMode();
  const [legalModal, setLegalModal] = useState(null);
  const [formValues, setFormValues] = useState(defaultForm);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
    setSuccessMessage("");

    if (formValues.password !== formValues.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage(
        "Please agree to the Terms of Service and Privacy Policy.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await signup({ email: formValues.email, password: formValues.password });
      setSuccessMessage("Account created successfully. You can now sign in.");
      setFormValues(defaultForm);
      setAgreedToTerms(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Join our booking management platform
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              width: "100%",
              maxWidth: 640,
              border: "1px solid",
              borderColor: "divider",
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
                      <PersonOutlineIcon
                        sx={{ fontSize: 18, color: "#9131f5" }}
                      />{" "}
                      Full Name
                    </Typography>
                    <TextField
                      name="fullName"
                      placeholder="John Doe"
                      value={formValues.fullName}
                      onChange={onChangeField}
                      required
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
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
                      <MailOutlineIcon
                        sx={{ fontSize: 18, color: "#9131f5" }}
                      />{" "}
                      Email Address
                    </Typography>
                    <TextField
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={formValues.email}
                      onChange={onChangeField}
                      required
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
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
                      <LockOutlinedIcon
                        sx={{ fontSize: 18, color: "#9131f5" }}
                      />{" "}
                      Password
                    </Typography>
                    <TextField
                      name="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formValues.password}
                      onChange={onChangeField}
                      required
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
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
                      <LockOutlinedIcon
                        sx={{ fontSize: 18, color: "#9131f5" }}
                      />{" "}
                      Confirm Password
                    </Typography>
                    <TextField
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formValues.confirmPassword}
                      onChange={onChangeField}
                      required
                      fullWidth
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          backgroundColor: "background.default",
                        },
                      }}
                    />
                  </Box>

                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={agreedToTerms}
                        onChange={(event) =>
                          setAgreedToTerms(event.target.checked)
                        }
                        sx={{ pt: "1px", pb: 0 }}
                      />
                    }
                    sx={{ alignItems: "flex-start", textAlign: "left", ml: 0 }}
                    label={
                      <Typography variant="body2">
                        I agree to the{" "}
                        <Link
                          component="button"
                          type="button"
                          underline="hover"
                          onClick={() => setLegalModal("terms")}
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          component="button"
                          type="button"
                          underline="hover"
                          onClick={() => setLegalModal("privacy")}
                        >
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    endIcon={!isSubmitting ? <ArrowForwardIcon /> : null}
                    sx={{
                      mt: 0.4,
                      py: 1.2,
                      borderRadius: "10px",
                      textTransform: "none",
                      fontSize: 20,
                      fontWeight: 600,
                      background:
                        "linear-gradient(90deg, #8e2de2 0%, #2e62eb 100%)",
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={22} color="inherit" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </Stack>
              </Box>

              {errorMessage ? (
                <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
                  {errorMessage}
                </Alert>
              ) : null}

              {successMessage ? (
                <Alert severity="success" sx={{ mt: 2, textAlign: "left" }}>
                  {successMessage}
                </Alert>
              ) : null}

              <Typography variant="body1" sx={{ mt: 3 }}>
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Sign in
                </Link>
              </Typography>
            </CardContent>
          </Card>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.5}
          >
            <Typography variant="body2" color="text.secondary">
              &copy; 2026 Smart Booking System. All rights reserved.
            </Typography>
            <Button
              onClick={toggleColorMode}
              size="small"
              aria-label="toggle color mode"
              startIcon={
                mode === "light" ? (
                  <DarkModeOutlinedIcon />
                ) : (
                  <LightModeOutlinedIcon />
                )
              }
              sx={{
                borderRadius: "20px",
                px: 1.5,
                py: 0.5,
                textTransform: "none",
                fontSize: 13,
                fontWeight: 500,
                border: "1px solid",
                borderColor: "divider",
                color: "text.secondary",
                backgroundColor: "background.paper",
                "&:hover": {
                  backgroundColor: "action.hover",
                  borderColor: "text.secondary",
                },
              }}
            >
              {mode === "light" ? "Dark mode" : "Light mode"}
            </Button>
          </Stack>
        </Stack>
      </Container>

      <LegalModal
        open={legalModal !== null}
        onClose={() => setLegalModal(null)}
        type={legalModal}
      />
    </>
  );
}
