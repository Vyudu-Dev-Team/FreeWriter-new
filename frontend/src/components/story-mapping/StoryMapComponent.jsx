import React from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    AppBar,
    Toolbar,
} from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Icons } from '../../utils/icon';

const StoryCard = ({ text }) => (
    <Paper
        elevation={0}
        sx={{
            width: 150,
            height: 150,
            border: '2px solid black',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontFamily: 'Quicksand, sans-serif',
        }}
    >

        {text}
    </Paper>
);

const SectionLabel = ({ text }) => (
    <Box
        sx={{
            color: 'white',
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            borderRadius: 1,
            fontFamily: 'PixelSplitter, monospace',
            fontSize: '14px',
        }}
    >
        <Box
            sx={{
                p: 3,
                textAlign: 'center',
                width: '12rem',
                bgcolor: '#E84A1C',
                borderRadius: 2,
            }}
        >
            {text}
        </Box>
    </Box>
);

const StoryMap = () => {
    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: 'white',
            backgroundImage: 'linear-gradient(#e5e5e5 2px, transparent 1px)',
            backgroundSize: '100% 40px',
            backgroundRepeat: 'repeat-y',
            width: '100%',
        }}>
            <AppBar position="static" sx={{ bgcolor: 'black', height: '6rem', padding: 2 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Icons.NoteIcon sx={{ fontSize: 40 }} />
                    <Typography
                        variant="h6"
                        sx={{
                            fontFamily: 'PixelSplitter, monospace',
                            fontSize: '24px',
                        }}
                    >
                        STORYMAP
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'white',
                            color: 'black',
                            '&:hover': { bgcolor: 'grey.100' },
                            fontFamily: 'PixelSplitter, monospace',
                            textTransform: 'none',
                        }}
                    >
                        Back to Card
                    </Button>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4, position: 'relative' }}>
                {/* Notes icon */}
                <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                    <NoteAddIcon sx={{ fontSize: 40 }} />
                    <Typography variant="caption" display="block" textAlign="center">
                        
                    </Typography>
                </Box>

                {/* Inciting Incident Section */}
                <Box sx={{ mb: 6, display: 'flex', gap: 4 }}>
                    <SectionLabel text="INCITING INCIDENT" />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {Array(4).fill('Lorem ipsum dolor sit amet').map((text, index) => (
                            <StoryCard key={`incident-${index}`} text={text} />
                        ))}
                    </Box>
                </Box>

                {/* Conflict Section */}
                <Box sx={{ mb: 6, display: 'flex', gap: 4 }}>
                    <SectionLabel text="CONFLICT" />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {Array(2).fill('Lorem ipsum dolor sit amet').map((text, index) => (
                            <StoryCard key={`conflict-${index}`} text={text} />
                        ))}
                    </Box>
                </Box>

                {/* Resolution Section */}
                <Box sx={{ mb: 6, display: 'flex', gap: 4 }}>
                    <SectionLabel text="RESOLUTION" />
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {Array(5).fill('Lorem ipsum dolor sit amet').map((text, index) => (
                            <StoryCard key={`resolution-${index}`} text={text} />
                        ))}
                    </Box>
                </Box>

                {/* Character Avatar */}
                <Box
                    component="img"
                    src="/assets/images/round-vigil.svg"
                    alt="Round Vigil"
                    sx={{
                        position: 'fixed',
                        bottom: 20,
                        right: 20,
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        overflow: 'hidden',
                    }}
                >

                </Box>
            </Box>
        </Box>
    );
};

export default StoryMap;