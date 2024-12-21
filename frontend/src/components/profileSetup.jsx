import React from "react";
import {
    Box,
    Container,
    IconButton,
    Typography,
    Grid,
    Paper,
} from "@mui/material";
import { Help as HelpIcon, Settings as SettingsIcon, Edit, Share } from "@mui/icons-material";

const UserPage = () => {
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "black",
                backgroundImage:
                    "radial-gradient(rgba(50, 50, 50, 0.2) 2px, transparent 2px)",
                backgroundSize: "30px 30px",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 2,
                    alignItems: "center",
                }}
            >
                <Typography
                    component="h1"
                    sx={{
                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                        color: "#BFFF00",
                        fontSize: "2rem",
                    }}
                >
                    FREE<span style={{ color: "white" }}>WRITER</span>
                </Typography>
                <Box>
                    <IconButton sx={{ color: "white" }}>
                        <HelpIcon />
                    </IconButton>
                    <IconButton sx={{ color: "white" }}>
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                {/* Profile Section */}
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 4 }}>
                    <Box
                        sx={{
                            border: "2px solid #BFFF00",
                            borderRadius: "8px",
                            p: 0.5,
                            width: 120,
                            height: 120,
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/images/avatar-1.svg"
                            alt="User Name"
                            sx={{ width: "100%", height: "100%", borderRadius: "4px" }}
                        />
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        color: "white",
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    USER NAME
                                </Typography>
                                <IconButton size="small" sx={{ color: "#8A2BE2" }}>
                                    <Edit />
                                </IconButton>
                                <IconButton size="small" sx={{ color: "#8A2BE2" }}>
                                    <Share />
                                </IconButton>
                            </Box>
                            <Typography
                                sx={{
                                    color: "#BFFF00",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    fontSize: "1rem",
                                    textAlign: "left",
                                    mt: 1,
                                }}
                            >
                                LEGENDARY STORYTELLER
                            </Typography>
                        </Box>
                    </Box>

                    <Paper
                        sx={{
                            bgcolor: "transparent",
                            border: "2px solid #BFFF00",
                            p: 2,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            component="img"
                            src="/assets/images/badge-1.svg"
                            alt="Level Badge"
                            sx={{ width: 40, height: 40 }}
                        />
                        <Box>
                            <Typography
                                sx={{
                                    color: "white",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    fontSize: "1rem",
                                }}
                            >
                                LEVEL 7
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#BFFF00",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    fontSize: "0.6rem",
                                }}
                            >
                                BADGE NAME
                            </Typography>
                        </Box>
                    </Paper>
                </Box>

                {/* Stats Bar */}
                <Paper
                    sx={{
                        bgcolor: "#8A2BE2",
                        borderRadius: "16px",
                        p: 3,
                        mb: 4,
                    }}
                >
                    <Grid container spacing={2} justifyContent="space-around">
                        {[
                            { value: "13", label: "WRITTEN STORIES" },
                            { value: "2100", label: "POINTS" },
                            { value: "7", label: "WILD CARDS" },
                            { value: "7", label: "BADGES" },
                            { value: "13", label: "SAVED PROMPTS" },
                        ].map((stat, index) => (
                            <Grid item key={index}>
                                <Typography
                                    align="center"
                                    sx={{
                                        color: "white",
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        fontSize: "2.5rem",
                                        mb: 1,
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography
                                    align="center"
                                    sx={{
                                        color: "#BFFF00",
                                        fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        fontSize: "1.125rem",
                                    }}
                                >
                                    {stat.label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Content Sections */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography
                            sx={{
                                color: "#BFFF00",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                fontSize: "1rem",
                                mb: 2,
                            }}
                        >
                            MY STORIES
                        </Typography>
                        <Paper
                            sx={{
                                bgcolor: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                p: 2,
                                height: 300,
                            }}
                        >
                            <Grid container spacing={2}>
                                {[1, 2].map((item) => (
                                    <Grid item xs={6} key={item}>
                                        <Box
                                            sx={{
                                                bgcolor: "#1A1A1A",
                                                borderRadius: "4px",
                                                p: 1,
                                                height: 200,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                backgroundImage: `url('/assets/images/story-1.svg')`,
                                                backgroundSize: "cover",
                                                backgroundPosition: "center",
                                                backgroundRepeat: "no-repeat",
                                                cursor: "pointer",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "white",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                LOGLINE
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "white",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                STORY
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "#BFFF00",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                POSTER
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography
                            sx={{
                                color: "#BFFF00",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                fontSize: "1rem",
                                mb: 2,
                            }}
                        >
                            MY WILD CARDS
                        </Typography>
                        <Paper
                            sx={{
                                bgcolor: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                p: 2,
                                height: 300,
                            }}
                        >
                            <Grid container spacing={2}>
                                {[1, 2].map((item) => (
                                    <Grid item xs={6} key={item}>
                                        <Paper
                                            sx={{
                                                bgcolor: "#8A2BE2",
                                                borderRadius: "8px",
                                                p: 2,
                                                height: 200,
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                cursor: "pointer",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: "white",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "1rem",
                                                    textAlign: "center",
                                                }}
                                            >
                                                PLOT TWIST
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "white",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "0.8rem",
                                                    textAlign: "right",
                                                }}
                                            >
                                                #768
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Typography
                            sx={{
                                color: "#BFFF00",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                fontSize: "1rem",
                                mb: 2,
                            }}
                        >
                            MY BADGES
                        </Typography>
                        <Paper
                            sx={{
                                bgcolor: "rgba(0,0,0,0.5)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                p: 2,
                                height: 300,
                            }}
                        >
                            <Grid container spacing={2}>
                                {[1, 2].map((item) => (
                                    <Grid item xs={6} key={item}>
                                        <Paper
                                            sx={{
                                                bgcolor: "transparent",
                                                border: "2px solid #BFFF00",
                                                borderRadius: "8px",
                                                p: 2,
                                                height: 200,
                                                textAlign: "center",
                                                cursor: "pointer",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        >
                                            <Box
                                                component="img"
                                                src="/assets/images/badge-1.svg"
                                                alt={`Badge ${item}`}
                                                sx={{ width: 60, height: 60, mb: 1 }}
                                            />
                                            <Typography
                                                sx={{
                                                    color: "#BFFF00",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                LOREM IPSUM
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    color: "#BFFF00",
                                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                BADGE NAME
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default UserPage;