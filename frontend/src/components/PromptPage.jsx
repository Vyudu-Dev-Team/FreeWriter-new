import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Container,
    Button,
    Typography,
    IconButton,
    Grid,
    Paper,
    Radio,
    RadioGroup,
    Link,
} from "@mui/material";
import { Star, Cached, HelpOutline, Settings } from "@mui/icons-material";
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
            default: "#fff",
        },
    },
    typography: {
        fontFamily: 'PixelSplitter, "Courier New", monospace',
    },
});

// Styled components for consistency
const StyledContainer = styled(Container)({
    minHeight: "100vh",
    width: "100vw",
    maxWidth: "100% !important",
    backgroundImage: 'url("/assets/images/bg-grid.svg")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    overflowX: "hidden",
});

const PromptCard = styled(Paper)(({ theme, selected }) => ({
    position: "relative",
    padding: "1.5rem",
    cursor: "pointer",
    backgroundColor: selected ? theme.palette.common.black : theme.palette.common.white,
    color: selected ? theme.palette.common.white : theme.palette.common.black,
    border: `2px solid ${theme.palette.common.black}`,
    borderRadius: "16px",
    textAlign: "center",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
        backgroundColor: selected ? theme.palette.grey[800] : theme.palette.grey[100],
    },
}));

const CategoryCard = styled(Paper)(({ theme, color }) => ({
    position: "relative",
    padding: "1rem",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "1.2rem",
    fontFamily: 'PixelSplitter, "Courier New", monospace',
    backgroundColor: color === "primary" ? theme.palette.primary.main : theme.palette.secondary.main,
    color: color === "primary" ? theme.palette.common.white : theme.palette.common.black,
    borderRadius: "16px 16px 0 0",
    border: `3px solid ${theme.palette.common.black}`,
    margin: "0 auto",
    width: "250px",
    height: "140px",
    cursor: "pointer",
    "&:hover": {
        opacity: 0.9,
    },
}));

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

function PromptPage() {
    const [selectedPrompt, setSelectedPrompt] = useState(0);
    const [prompts, setPrompts] = useState([
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu",
    ]);

    const fetchPrompts = async () => {
        try {
            const response = await axios.get("/api/prompts");
            setPrompts(response.data.prompts);
        } catch (error) {
            console.error("Error fetching prompts:", error);
        }
    };

    const handleRefresh = () => {
        fetchPrompts();
    };

    useEffect(() => {
        fetchPrompts();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <StyledContainer>
                {/* Header */}
                <Grid container spacing={2} maxWidth="lg" style={{ justifyContent: "center" }}>
                    <Box display="flex" justifyContent="space-between" width="100%" mb={4}>
                        {/* Logo with Link */}
                        <Link href="/" style={{ textDecoration: "none" }}>
                            <Typography variant="h4" fontWeight="bold" style={{ color: "#fff", cursor: "pointer" }}>
                                <span style={{ color: theme.palette.secondary.main }}>FREE</span>
                                <span style={{ color: theme.palette.primary.main }}>WRITER</span>
                            </Typography>
                        </Link>

                        {/* Icons with Links */}
                        <Box display="flex" gap={2}>
                            <Link href="/help" style={{ textDecoration: "none" }}>
                                <IconButton color="inherit" style={{ color: "#000" }}>
                                    <HelpOutline />
                                </IconButton>
                            </Link>
                            <Link href="/settings" style={{ textDecoration: "none" }}>
                                <IconButton color="inherit" style={{ color: "#000" }}>
                                    <Settings />
                                </IconButton>
                            </Link>
                        </Box>
                    </Box>
                </Grid>

                {/* Main Title */}
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                    style={{ color: "#000", marginBottom: "2rem" }}
                >
                    TELL A STORY ABOUT...
                </Typography>

                {/* Prompt Cards */}
                <RadioGroup
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(Number(e.target.value))}
                >
                    <Grid container spacing={3} maxWidth="md" justifyContent="center" mb={4}>
                        <Grid item xs={12} sm={8}>
                            <PromptCard
                                selected={selectedPrompt === 0}
                                onClick={() => setSelectedPrompt(0)}
                            >
                                <Radio
                                    value={0}
                                    checked={selectedPrompt === 0}
                                    style={{ display: "none" }}
                                />
                                <Typography variant="body1" style={{ flex: 1 }}>
                                    {prompts[0]}
                                </Typography>
                                <Star
                                    style={{
                                        color: selectedPrompt === 0 ? "white" : "black",
                                    }}
                                />
                            </PromptCard>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <PromptCard
                                selected={selectedPrompt === 1}
                                onClick={() => setSelectedPrompt(1)}
                            >
                                <Radio
                                    value={1}
                                    checked={selectedPrompt === 1}
                                    style={{ display: "none" }}
                                />
                                <Typography variant="body1" style={{ flex: 1 }}>
                                    {prompts[1]}
                                </Typography>
                                <Star
                                    style={{
                                        color: selectedPrompt === 1 ? "white" : "black",
                                    }}
                                />
                            </PromptCard>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <PromptCard
                                selected={selectedPrompt === 2}
                                onClick={() => setSelectedPrompt(2)}
                            >
                                <Radio
                                    value={2}
                                    checked={selectedPrompt === 2}
                                    style={{ display: "none" }}
                                />
                                <Typography variant="body1" style={{ flex: 1 }}>
                                    {prompts[2]}
                                </Typography>
                                <Star
                                    style={{
                                        color: selectedPrompt === 2 ? "white" : "black",
                                    }}
                                />
                            </PromptCard>
                        </Grid>
                    </Grid>
                </RadioGroup>

                {/* Choose and Refresh Buttons */}
                <Box display="flex" gap={2} mb={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ borderRadius: 0 }}
                    >
                        CHOOSE THIS PROMPT
                    </Button>
                    <IconButton color="inherit" size="large" style={{ color: "#000" }} onClick={handleRefresh}>
                        <Cached fontSize="large"/>
                    </IconButton>
                </Box>

                {/* Category Buttons */}
                <FixedBottomWrapper>
                    <Grid container spacing={2} justifyContent="center">
                        <Grid item>
                            <CategoryCard color="primary">CHARACTER</CategoryCard>
                        </Grid>
                        <Grid item>
                            <CategoryCard color="secondary">WORLD</CategoryCard>
                        </Grid>
                        <Grid item>
                            <CategoryCard color="primary">CONFLICT</CategoryCard>
                        </Grid>
                    </Grid>
                </FixedBottomWrapper>
            </StyledContainer>
        </ThemeProvider>
    );
}

export default PromptPage;
