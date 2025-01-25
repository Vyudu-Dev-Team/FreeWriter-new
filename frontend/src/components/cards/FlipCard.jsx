import React, { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';

const FlipCard = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    if (!card) return null;

    const getCardImage = (type) => {
        switch(type.toUpperCase()) {
            case 'CHARACTER':
                return '/assets/cards/cardCharacterBackgroundIcon.svg';
            case 'WORLD':
                return '/assets/cards/cardWorldBackgroundIcon.svg';
            case 'CONFLICT':
                return '/assets/cards/cardConflictBackgroundIcon.svg';
            default:
                return 'https://placehold.co/400x250';
        }
    };

    const cardImage = getCardImage(card.Type);

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
                        src={cardImage}
                        alt={card.Name}
                        sx={{ width: '100%', height: '400px', mt: 1 }}
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
                    <div>
                        <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter', margin: 0, lineHeight: 1.25 }}>
                            {card.Type || 'Tipo não definido'}
                        </Typography>
                        <Typography variant="subtitle1" sx={{ fontFamily: 'Quicksand', margin: 0, lineHeight: 1.0 }}>
                        {card.Name || 'Nome não definido'}
                        </Typography>
                    </div>
                    <Box
                        component="img"
                        src={cardImage}
                        alt={card.Name}
                        sx={{ width: '100%', height: '300px' }}
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