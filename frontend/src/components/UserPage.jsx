import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Container,
    IconButton,
    Typography,
    Grid,
    Paper,
    CircularProgress,
} from "@mui/material";
import {
    Help as HelpIcon,
    Settings as SettingsIcon,
    Edit,
    Share,
} from "@mui/icons-material";
import { useAppContext } from '../contexts/AppContext';

const UserPage = () => {
    const { state } = useAppContext();
    const [userProfile, setUserProfile] = useState({
        name: state?.user?.user?.username,
        username: state?.user?.user?.username,
        email: state?.user?.user?.email,
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
        avatar: '/assets/profile/defaultProfileIcon.svg',
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
        setUserProfile({
            name: state?.user?.user?.username,
            username: state?.user?.user?.username,
            email: state?.user?.user?.email,
        });
    }, [state?.user?.user?.username, state?.user?.user?.email]);

    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await fetch(`/api/profile/${userId}`);
    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch profile");
    //             }
    //             const data = await response.json();
    //             setUserProfile(data);
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchProfile();
    // }, [userId]);

    // const handleUpdateProfile = async (updatedProfile) => {
    //     try {
    //         setLoading(true);
    //         const response = await fetch(`/api/profile/${userId}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(updatedProfile),
    //         });
    //         if (!response.ok) {
    //             throw new Error("Failed to update profile");
    //         }
    //         const data = await response.json();
    //         setUserProfile(data);
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

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

    return (
        <Box
            sx={{
                minHeight: "100vh",
                bgcolor: "black",
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
                            src='/assets/profile/defaultProfileIcon.svg'
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
                            background: `url('/assets/images/story-bg.svg') no-repeat center center`,
                            backgroundSize: "cover",
                            height: "500px",
                            justifyContent: "center",
                            alignItems: "center",
                            backdropFilter: "blur(10px)",
                        }}
                    >

                        <Typography
                            sx={{
                                color: "white",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                // position: "absolute",
                                textAlign: "center",
                                
                                width: "100%",
                            }}
                        >
                            Go back to your writing-environment
                        </Typography>

                        <Typography
                            sx={{
                                color: "white",
                                fontFamily: 'PixelSplitter, "Courier New", monospace',
                                marginTop: "20px",
                            }}
                        >
                            The user page is under construction, please wait for the next update. Click here to go back to your writing-environment.
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
                                            src={`/assets/profile/story-${item}.svg`}
                                            alt={`Story Deck ${item}`}
                                            sx={{
                                                width: "100%",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                transition: "transform 0.2s",
                                                "&:hover": {
                                                    transform: "scale(1.02)",
                                                },
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

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
                                            src={`/assets/icons/badge.svg`}
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
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default UserPage;
