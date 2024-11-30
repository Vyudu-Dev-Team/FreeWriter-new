import React from "react";
import {
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { HelpOutline, Settings, Star } from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

// Create a custom theme for styling
const theme = createTheme({
  palette: {
    primary: {
      main: "#6c5ce7",
    },
    secondary: {
      main: "#b8ff57",
    },
    background: {
      default: "#000",
    },
  },
  typography: {
    fontFamily: 'PixelSplitter, "Courier New", monospace',
  },
});

// Styled components
const StyledContainer = styled(Container)({
  minHeight: "100vh",
  width: "100vw",
  maxWidth: "100% !important",
  backgroundImage: 'url("/assets/images/bg-grid.svg")',
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundColor: "#000",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "2rem",
  overflowX: "hidden",
});

const PromptCard = styled(Paper)({
  position: "relative",
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "24px",
  width: "100%",
  maxWidth: "800px",
  margin: "2rem 0",
  textAlign: "center",
  border: "3px solid #000",
});

const CategoryCard = styled(Box)(({ color }) => ({
  position: "relative",
  width: "220px",
  height: "300px",
  backgroundColor: color === "primary" ? "#6c5ce7" : "#b8ff57",
  color: color === "primary" ? "#fff" : "#000",
  borderRadius: "16px",
  padding: "10px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
  "&:hover": {
    transform: "translateY(-5px)",
  },
}));

const CategoryCardContent = styled(Box)({
  borderRadius: "inherit",
  border: "3px solid #000",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const FixedBottomWrapper = styled(Box)(({ theme }) => ({
  overflow: "hidden",
  position: "fixed",
  bottom: 0,
  width: "100%",
  backgroundColor: theme.palette.common.black,
  paddingTop: "3rem",
  paddingBottom: 0,
  borderRadius: "16px 16px 0 0",
  display: "flex",
  justifyContent: "space-evenly",
  alignItems: "center",
  zIndex: 10,
}));

export default function PromptSelectedPage() {
  return (
    <ThemeProvider theme={theme}>
      <StyledContainer>
        {/* Header */}
        <Grid container spacing={2} maxWidth="lg" style={{ justifyContent: "center" }}>
          <Box display="flex" justifyContent="space-between" width="100%" mb={4}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none" }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                style={{ color: "#fff", cursor: "pointer" }}
              >
                <span style={{ color: theme.palette.secondary.main }}>FREE</span>
                <span style={{ color: theme.palette.primary.main }}>WRITER</span>
              </Typography>
            </Link>

            {/* Icons */}
            <Box display="flex" gap={2}>
              <IconButton color="inherit" style={{ color: "#000" }}>
                <HelpOutline />
              </IconButton>
              <IconButton color="inherit" style={{ color: "#000" }}>
                <Settings />
              </IconButton>
            </Box>
          </Box>
        </Grid>

        {/* Prompt Card */}
        <PromptCard elevation={3}>
          <Typography
            variant="h4"
            gutterBottom
            style={{
              fontFamily: 'PixelSplitter, "Courier New", monospace',
              marginBottom: "1rem",
            }}
          >
            TELL A STORY ABOUT...
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: 'PixelSplitter, "Courier New", monospace',
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu
          </Typography>
          <Box position="absolute" bottom="1rem" right="1rem">
            <Star style={{ color: "#000" }} />
          </Box>
        </PromptCard>

        {/* Category Cards */}
        <FixedBottomWrapper>
          <Grid container spacing={3} justifyContent="center">
            <Grid item>
              {/* Character */}
              <CategoryCard color="primary">
                <CategoryCardContent>
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: 'PixelSplitter, "Courier New", monospace',
                      marginBottom: "1rem",
                    }}
                  >
                    CHARACTER
                  </Typography>
                  <Box
                    component="img"
                    src="/assets/images/wizard-1.svg"
                    alt="Character"
                    sx={{ width: 100, height: 100 }}
                  />
                </CategoryCardContent>
              </CategoryCard>
            </Grid>

            <Grid item>
              {/* World */}
              <CategoryCard color="secondary">
                <CategoryCardContent>
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: 'PixelSplitter, "Courier New", monospace',
                      marginBottom: "1rem",
                    }}
                  >
                    WORLD
                  </Typography>
                  <Box
                    component="img"
                    src="/assets/images/storm-1.svg"
                    alt="World"
                    sx={{ width: 100, height: 100 }}
                  />
                </CategoryCardContent>
              </CategoryCard>

            </Grid>

            <Grid item>
              {/* Conflict */}
              <CategoryCard color="primary">
                <CategoryCardContent>
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: 'PixelSplitter, "Courier New", monospace',
                      marginBottom: "1rem",
                    }}
                  >
                    CONFLICT
                  </Typography>
                  <Box
                    component="img"
                    src="/assets/images/sword-3.svg"
                    alt="Conflict"
                    sx={{ width: 100, height: 100 }}
                  />
                </CategoryCardContent>
              </CategoryCard>
            </Grid>
          </Grid>
        </FixedBottomWrapper>
      </StyledContainer>
    </ThemeProvider>
  );
}
