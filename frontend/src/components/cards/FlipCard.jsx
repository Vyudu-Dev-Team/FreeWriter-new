import React, { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';

const FlipCard = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    if (!card) return null;

    return (
        <Box
            sx={{
                width: '403px',
                height: '578px',
                perspective: '1000px',
                cursor: 'pointer',
            }}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.6s',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
                }}
            >
                {/* Frente da Carta */}
                <Card
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        bgcolor: card.Type === 'WORLD' ? '#D8F651' : '#490BF4',
                        color: card.Type === 'WORLD' ? 'black' : 'white',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography variant="h5" sx={{ fontFamily: 'PixelSplitter', alignSelf: 'start' }}>
                        {card.Type || 'Tipo não definido'}
                    </Typography>
                    <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter', alignSelf: 'start' }}>
                        {card.Name || 'Nome não definido'}
                    </Typography>
                    <Box
                        component="img"
                        src={'https://placehold.co/400x250'}
                        alt={card.Name}
                        sx={{ width: '100%', height: '300', my: 2 }}
                    />
                </Card>

                {/* Verso da Carta */}
                <Card
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        bgcolor: card.Type === 'WORLD' ? '#D8F651' : '#490BF4',
                        color: card.Type === 'WORLD' ? 'black' : 'white',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter' }}>
                        {card.Type || 'Tipo não definido'}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontFamily: 'Quicksand' }}>
                        {card.Name || 'Nome não definido'}
                    </Typography>
                    <Box
                        component="img"
                        src={'https://placehold.co/400x250'}
                        alt={card.Name}
                        sx={{ width: '100%', height: '300', my: 2 }}
                    />
                    <Typography variant="body1" sx={{ flex: 1, fontFamily: 'Quicksand' }}>
                        {card.Description || 'Descrição não definida'}
                    </Typography>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontFamily: 'Quicksand', fontSize: '11px' }}>
                        Theme: {card.Theme || 'Tema não definido'}
                    </Typography>
                </Card>
            </Box>
        </Box>
    );
};

export default FlipCard; 