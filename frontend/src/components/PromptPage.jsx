import React, { useState, useEffect } from "react";
import axios from "axios"; // Axios for API calls
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
    FormControlLabel,
    Link,
} from "@mui/material";
import { Star, Cached, HelpOutline, Settings } from "@mui/icons-material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { aiAPI } from '../services/api';

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
    backgroundImage: 'url("/assets/images/white-paper.jpg")',
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

const CategoryButton = styled(Button)(({ theme, color }) => ({
    padding: "1.5rem",
    fontSize: "1.25rem",
    fontWeight: "bold",
    borderRadius: "16px",
    backgroundColor: color === "primary" ? theme.palette.primary.main : theme.palette.secondary.main,
    color: color === "primary" ? theme.palette.common.white : theme.palette.common.black,
    "&:hover": {
        opacity: 0.9,
    },
}));

const GridContainer = styled(Grid)({
    backgroundColor: "#000",
    borderRadius: "16px",
    padding: "2rem",
});

function PromptPage() {
    const [selectedPrompt, setSelectedPrompt] = useState(0);
    const [prompts, setPrompts] = useState([
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu",
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc maximus lacinia eros, at pellentesque mi hendrerit eu",
    ]);

    const fetchPrompts = async () => {
        try {
            const response = await aiAPI.generatePrompt({});
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
                    <Grid container spacing={3} maxWidth="md" mb={4}>
                        {prompts.map((prompt, index) => (
                            <Grid item xs={12} sm={12} key={index}>
                                <PromptCard selected={selectedPrompt === index} onClick={() => setSelectedPrompt(index)}>
                                    <Radio
                                        value={index}
                                        checked={selectedPrompt === index}
                                        style={{ display: "none" }}
                                    />
                                    <Typography variant="body1" style={{ flex: 1 }}>
                                        {prompt}
                                    </Typography>
                                    <Star
                                        style={{
                                            color: selectedPrompt === index ? "white" : "black",
                                        }}
                                    />
                                </PromptCard>
                            </Grid>
                        ))}
                    </Grid>
                </RadioGroup>

                {/* Choose and Refresh Buttons */}
                <Box display="flex" gap={2} mb={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ borderRadius: "16px" }}
                    >
                        CHOOSE THIS PROMPT
                    </Button>
                    <IconButton color="inherit" size="large" style={{ color: "#000" }} onClick={handleRefresh}>
                        <Cached />
                    </IconButton>
                </Box>

                {/* Category Buttons */}
                <GridContainer container spacing={2} maxWidth="lg" style={{ justifyContent: "center" }}>
                    <Grid item xs={12} sm={3}>
                        <CategoryButton color="primary" fullWidth>
                            CHARACTER
                        </CategoryButton>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <CategoryButton color="secondary" fullWidth>
                            WORLD
                        </CategoryButton>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                        <CategoryButton color="primary" fullWidth>
                            CONFLICT
                        </CategoryButton>
                    </Grid>
                </GridContainer>
            </StyledContainer>
        </ThemeProvider>
    );
}

export default PromptPage;
