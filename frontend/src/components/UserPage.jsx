<<<<<<< HEAD
import React from "react";
=======
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
import {
    Box,
    Container,
    IconButton,
    Typography,
    Grid,
    Paper,
<<<<<<< HEAD
} from "@mui/material";
import { Help as HelpIcon, Settings as SettingsIcon, Edit, Share } from "@mui/icons-material";

const UserPage = () => {
=======
    CircularProgress,
} from "@mui/material";
import {
    Help as HelpIcon,
    Settings as SettingsIcon,
    Edit,
    Share,
} from "@mui/icons-material";

const UserPage = () => {
    const { userId } = useParams();
    const [userProfile, setUserProfile] = useState({
        name: 'Jane Smith',
        username: 'janesmith',
        email: 'jane.smith@example.com',
        bio: 'Aspiring author with a passion for speculative fiction and creative storytelling.',
        genres: ['Science Fiction', 'Fantasy', 'Horror', 'Adventure'],
        wordCount: 175000,
        storiesPublished: 20,
        goals: ['finish_draft_of_novel', 'write_short_story'],
        preferences: {
            theme: 'light',
            language: 'English',
        },
        achievements: {
            badges: 25,
            points: 4800,
            savedPrompts: 18,
            friends: 10,
        },
        avatar: '/assets/images/avatar-2.svg',
        recentStories: [
            {
                title: 'The Lost City',
                description: 'A thrilling adventure set in the heart of an ancient, mysterious city.',
                imageUrl: '/assets/images/story-1.svg',
            },
            {
                title: 'Into the Abyss',
                description: 'A psychological horror that takes place in the deepest parts of the ocean.',
                imageUrl: '/assets/images/story-2.svg',
            },
        ],
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/profile/${userId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                const data = await response.json();
                setUserProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    const handleUpdateProfile = async (updatedProfile) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/profile/${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProfile),
            });
            if (!response.ok) {
                throw new Error("Failed to update profile");
            }
            const data = await response.json();
            setUserProfile(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    bgcolor: "black",
                }}
            >
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // if (error) {
    //     return (
    //         <Box
    //             sx={{
    //                 display: "flex",
    //                 justifyContent: "center",
    //                 alignItems: "center",
    //                 minHeight: "100vh",
    //                 bgcolor: "black",
    //             }}
    //         >
    //             <Typography color="error">{error}</Typography>
    //         </Box>
    //     );
    // }

>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "black",
<<<<<<< HEAD
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
=======
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
            }}
        >
            <Container>
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
            </Container>

            <Container sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", gap: 4 }}>
                    {/* User Info */}
                    <Paper
                        sx={{
                            bgcolor: "#4300FF",
                            borderRadius: "16px",
                            p: 3,
                            width: "40%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            position: "relative",
                        }}
                    >
                        <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 1 }}>
                            <IconButton
                                sx={{ color: "white" }}
                                onClick={() => handleUpdateProfile({
                                    goals: ["finish_novel"],
                                    preferences: { theme: "dark" },
                                })}
                            >
                                <Edit />
                            </IconButton>
                            <IconButton sx={{ color: "white" }}>
                                <Share />
                            </IconButton>
                        </Box>
                        <Box
                            component="img"
                            src="/assets/images/avatar-1.svg"
                            alt="User Avatar"
                            sx={{ width: 120, height: 120, borderRadius: "5px", mb: 2 }}
                        />
                        <Typography
                            variant="h4"
                            sx={{
                                color: "white",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                textAlign: "center",
                            }}
                        >
                            {userProfile.username || "USER NAME"}
                        </Typography>
                        <Typography
                            sx={{
                                color: "#BFFF00",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            LEGENDARY STORYTELLER
                        </Typography>

                        <Grid
                            container
                            spacing={2}
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#000",
                                padding: "1rem",
                                borderRadius: "30px",
                            }}
                        >
                            {[
                                { value: "13", label: "WRITTEN STORIES" },
                                { value: "13", label: "SAVED PROMPTS" },
                                { value: "39", label: "BADGES" },
                                { value: "3100", label: "POINTS" },
                                { value: "7", label: "FRIENDS" },
                            ].map((stat, index) => (
                                <Grid item xs={6} key={index}>
                                    <Typography
                                        sx={{
                                            color: "white",
                                            fontSize: "1.5rem",
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        }}
                                    >
                                        {stat.value}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            color: "#BFFF00",
                                            fontSize: "0.75rem",
                                            fontFamily: 'PixelSplitter, "Courier New", monospace',
                                        }}
                                    >
                                        {stat.label}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>

                    {/* Story Section */}
                    <Paper
                        sx={{
                            bgcolor: "rgba(0,0,0,0.6)",
                            borderRadius: "16px",
                            p: 2,
                            width: "50%",
                            display: "flex",
                            flexDirection: "column",
                            position: "relative",
>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
                        }}
                    >
                        <Box
                            component="img"
<<<<<<< HEAD
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
=======
                            src="/assets/images/story-bg.svg"
                            alt="Story Banner"
                            sx={{ width: "100%", borderRadius: "8px", mb: 2, cursor: "pointer", }}
                        />
                        <Typography
                            sx={{
                                color: "white",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                position: "absolute",
                                textAlign: "left",
                                bottom: 45,
                                left: 30,
                                width: "100%",
                            }}
                        >
                            STORY NAME
                        </Typography>
                    </Paper>

                    <Box sx={{ width: "30%", display: "flex", flexDirection: "column", gap: 2 }}>
                        {/* Story Decks Section */}
                        <Paper
                            sx={{
                                bgcolor: "rgba(0,0,0,0.6)",
                                borderRadius: "16px",
                                border: "solid 2px #fff",
                                p: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    fontSize: "1rem",
                                    mb: 2,
                                    textAlign: "center",
                                }}
                            >
                                STORY DECKS
                            </Typography>
                            <Grid container spacing={2}>
                                {[1, 2, 3, 4].map((item) => (
                                    <Grid item xs={6} key={item}>
                                        <Box
                                            component="img"
                                            src={`/assets/images/story-${item}.svg`}
                                            alt={`Story Deck ${item}`}
                                            sx={{
                                                width: "100%",
                                                borderRadius: "8px",
>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
                                                cursor: "pointer",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
<<<<<<< HEAD
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
=======
                                        />
>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
<<<<<<< HEAD
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
=======

                        {/* Badges Section */}
                        <Paper
                            sx={{
                                border: "solid 2px #fff",
                                bgcolor: "rgba(0,0,0,0.6)",
                                borderRadius: "16px",
                                p: 2,
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#fff",
                                    fontFamily: 'PixelSplitter, "Courier New", monospace',
                                    fontSize: "1rem",
                                    mb: 2,
                                    textAlign: "center",
                                }}
                            >
                                BADGES
                            </Typography>
                            <Grid container spacing={2}>
                                {[1, 2, 3].map((item) => (
                                    <Grid item xs={4} key={item}>
                                        <Box
                                            component="img"
                                            src={`/assets/images/badge-1.svg`}
                                            alt={`Badge ${item}`}
                                            sx={{
                                                width: "100%",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.05)",
                                                },
                                            }}
                                        />
>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
<<<<<<< HEAD
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
=======
                    </Box>
                </Box>
>>>>>>> 25bcade1a7e65615452e0c30713a0daadda9e2b2
            </Container>
        </Box>
    );
};

export default UserPage;
