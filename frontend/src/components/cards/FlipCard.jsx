import React, { useState } from 'react';
import { Box, Card, Typography } from '@mui/material';

const FlipCard = ({ card }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    if (!card) return null;

    const getCardImage = (type) => {
        if (!type) return 'https://placehold.co/400x300';
        
        switch(type.toString().toUpperCase()) {
            case 'CHARACTER':
                return '/assets/cards/cardCharacterBackgroundIcon.svg';
            case 'WORLD':
                return '/assets/cards/cardWorldBackgroundIcon.svg';
            case 'CONFLICT':
                return '/assets/cards/cardConflictBackgroundIcon.svg';
            default:
                return 'https://placehold.co/400x300';
        }
    };

    const cardImage = getCardImage(card.Type);
    const cardType = card.Type || 'UNDEFINED';
    const isWorldCard = cardType === 'WORLD';

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
                        bgcolor: isWorldCard ? '#D8F651' : '#6600D2',
                        color: isWorldCard ? 'black' : 'white',
                        p: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.7,
                        borderRadius: '18px',
                    }}
                >
                    <Typography variant="h5" sx={{ fontFamily: 'PixelSplitter', alignSelf: 'center', fontSize: '15px' }}>
                        {cardType}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '95%', alignSelf: 'center', backgroundColor: 'black', borderRadius: '17px', height: '100%' }}>
                    
                        <Box
                            component="img"
                            src={cardImage}
                            alt={card.Name || 'Card image'}
                            sx={{ width: '100%', height: '450px', mt: 1 }}
                        />
                    </Box>
                    
                    <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter', alignSelf: 'center' }}>
                        {card.Name || 'Nome não definido'}
                    </Typography>
                </Card>

                {/* Verso da Carta */}
                <Card
                    sx={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        bgcolor: isWorldCard ? '#D8F651' : '#6600D2',
                        color: isWorldCard ? 'black' : 'white',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <div>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter', margin: 0, lineHeight: 1.25 }}>
                                {cardType}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', p: 1, backgroundColor: 'black', borderRadius: '9px', color: '#D8F651' }}>
                            <Typography variant="subtitle1" sx={{ fontFamily: 'Quicksand', margin: 0, lineHeight: 1.0 }}>
                                {card.Name || 'Nome não definido'}
                            </Typography>
                        </Box>
                    </div>
                    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', alignSelf: 'center', backgroundColor: 'black', borderRadius: '17px', height: '250px', position: 'relative' }}>
                        <Box
                            component="img"
                            src={cardImage}
                            alt={card.Name || 'Card image'}
                            sx={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 1, border: '3.75px solid black', width: '100%', borderRadius: '9.76px', p: '10px', height: '100%' }}>
                        <Typography variant="body1" sx={{ flex: 1, fontFamily: 'Quicksand' }}>
                            {card.Description || 'Descrição não definida'}
                        </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontStyle: 'italic', fontFamily: 'Quicksand', fontSize: '11px' }}>
                        Theme: {card.Theme || 'Tema não definido'}
                    </Typography>
                </Card>
            </Box>
        </Box>
    );
};

export default FlipCard; 