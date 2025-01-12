import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  IconButton,
  InputAdornment,
  Container,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../contexts/AppContext";
import { ArrowBack } from "@mui/icons-material";
import { styled } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material";

// Add the custom theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#b8ff57",
    },
    secondary: {
      main: "#6c5ce7",
    },
  },
  typography: {
    fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "white",
          "& .MuiInputBase-root": {
            backgroundColor: "white",
            fontFamily: 'Quicksand, "Courier New", Courier, monospace',
          },
          "& .MuiInputBase-input": {
            color: "black",
            backgroundColor: "white",
            fontFamily: 'Quicksand, "Courier New", Courier, monospace',
            fontWeight: "bold",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "transparent",
            },
            "&:hover fieldset": {
              borderColor: "transparent",
            },
            "&.Mui-focused fieldset": {
              borderColor: "transparent",
            },
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'PixelSplitter, "Courier New", Courier, monospace',
        },
      },
    },
  },
});

const StyledContainer = styled(Container)({
  minHeight: "100vh",
  width: "100vw",
  maxWidth: "100% !important",
  margin: 0,
  padding: "2rem",
  display: "flex",
  flexDirection: "column",
  backgroundColor: "black",
  color: "white",
  position: "relative",
});

const StyledForm = styled("form")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
});

function LoginComponent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    login,
    state: { error: serverError },
    dispatch,
  } = useAppContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", payload: null });

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const success = await login({
        email: formData.email,
        password: formData.password,
      }); // FIXED

      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        <Link
          href="/introduction"
          color="inherit"
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <ArrowBack sx={{ mr: 1 }} />
          GO BACK
        </Link>

        <Box
          sx={{
            width: "100%",
            maxWidth: "500px",
            margin: "auto",
            mt: "4rem",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            gutterBottom
            sx={{ mb: 4, letterSpacing: 4, fontSize: "50px" }}
          >
            LOG IN
          </Typography>

          <StyledForm onSubmit={handleSubmit} autoComplete="off">
            {serverError && (
              <Alert
                severity="error"
                onClose={() => dispatch({ type: "SET_ERROR", payload: null })}
                sx={{
                  mb: 2,
                  backgroundColor: "rgba(211, 47, 47, 0.1)",
                  color: "#ff3333",
                  "& .MuiAlert-icon": {
                    color: "#ff3333",
                  },
                }}
              >
                {serverError}
              </Alert>
            )}

            <Box>
              <Typography
                variant="caption"
                component="label"
                htmlFor="email"
                sx={{
                  display: "block",
                  textAlign: "left",
                  mb: 1,
                  fontSize: "20px",
                }}
              >
                EMAIL:
              </Typography>
              <TextField
                fullWidth
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="EMAIL"
                autoComplete="off"
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiInputBase-root": {
                    height: "56px",
                  },
                  "& .MuiFormHelperText-root": {
                    backgroundColor: "black",
                    color: "red",
                    margin: 0,
                    padding: "4px 8px",
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                variant="caption"
                component="label"
                htmlFor="password"
                sx={{
                  display: "block",
                  textAlign: "left",
                  mb: 1,
                  fontSize: "20px",
                }}
              >
                PASSWORD:
              </Typography>
              <TextField
                fullWidth
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                type={showPassword ? "text" : "password"}
                placeholder="PASSWORD"
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        sx={{
                          color: "black",
                        }}
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={(e) => e.preventDefault()}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  "& .MuiInputBase-root": {
                    height: "56px",
                  },
                  "& .MuiFormHelperText-root": {
                    backgroundColor: "black",
                    color: "white",
                    margin: 0,
                    padding: "4px px",
                  },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 4 }}>
              <Button
                onClick={() => {
                  dispatch({ type: "SET_ERROR", payload: null });
                  navigate("/register");
                }}
                variant="contained"
                fullWidth
                sx={{
                  flex: 2,
                  color: "white",
                  borderRadius: "1px",
                  fontSize: "20px",
                  bgcolor: "rgba(73, 11, 244, 1)",
                  opacity: 1,
                  "&:hover": {
                    bgcolor: "rgba(73, 11, 244, 1)",
                    opacity: 0.8,
                  },
                }}
              >
                CREATE AN ACCOUNT
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isLoading}
                sx={{
                  flex: 1,
                  color: "black",
                  borderRadius: "1px",
                  fontSize: "20px",
                  bgcolor: "rgba(216, 246, 81, 1)",
                }}
              >
                {isLoading ? "SIGNING IN..." : "SIGN IN"}
              </Button>
            </Box>

            <Typography
              align="center"
              sx={{
                mt: 4,
                fontSize: "20px",
                cursor: "pointer",
                textDecoration: "underline",
                "&:hover": {
                  color: "rgba(73, 11, 244, 0.9)",
                },
              }}
              onClick={() => navigate("/write")}
            >
              Write a Story Without an Account
            </Typography>
          </StyledForm>
        </Box>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default LoginComponent;
