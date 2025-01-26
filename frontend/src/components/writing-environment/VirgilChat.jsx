import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VirgilChat.css';
import './VirgilChat.scss';
import ApiService from '../../services/ApiService';
import { useAppContext } from '../../contexts/AppContext';
import NavBar from '../../components/commonComponents/Navbar';
import { Box, Card, Typography } from '@mui/material';
import FlipCard from '../../components/cards/FlipCard';

const VirgilChat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMessages, setHasMessages] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [conversationTitle, setConversationTitle] = useState('');
    const [cards, setCards] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const chatMessagesRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useAppContext();
    const username = state?.user?.user?.username || 'User';
    useEffect(() => {
        if (state?.user) {
            console.log('Current user state:', state.user);
            console.log('Current user state:', state.user.username);
        }
    }, [state?.user]);

    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const processApiResponse = (response) => {
        if (response) {
            const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
            console.log('Resposta parseada:', parsedResponse);
            
            // Se a resposta for um array, assume que são as cartas
            if (Array.isArray(parsedResponse)) {
                console.log('Cartas recebidas:', parsedResponse);
                
                // Mantém os dados originais e apenas atualiza a imageUrl se necessário
                const processedCards = parsedResponse.map(card => {
                    // Se a carta já tem imageUrl, mantém ela, senão gera uma nova baseada no Type
                    // const imageUrl = card.imageUrl === '/assets/images/default-card.svg' 
                    //     ? getCardImage(card.Type) 
                    //     : card.imageUrl;

                    const imageUrl = getCardImage(card.Type || card.type);
                    
                    return {
                        ...card,
                        imageUrl
                    };
                });

                console.log('Cartas processadas:', processedCards);
                setCards(processedCards);
                if (processedCards.length > 0) {
                    setSelectedCard(processedCards[0]);
                }
                return;
            }
            
            // Se não for array, processa como antes
            const aiMessage = {
                type: 'ai',
                content: parsedResponse.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);

            if (parsedResponse.conversationId) {
                setConversationId(parsedResponse.conversationId);
            }

            if (parsedResponse.title) {
                setConversationTitle(parsedResponse.title);
            }

            if (parsedResponse.card && Array.isArray(parsedResponse.card)) {
                console.log('Cartas recebidas:', parsedResponse.card);
                
                const processedCards = parsedResponse.card.map(card => ({
                    Type: card.Type || card.type?.toUpperCase() || 'UNDEFINED',
                    Name: card.Name || card.name || 'Nome não definido',
                    Description: card.Description || card.description || 'Descrição não definida',
                    Theme: card.Theme || card.theme || 'Tema não definido',
                    // imageUrl: card.imageUrl || getCardImage(card.Type || card.type)
                    imageUrl: getCardImage(card.Type || card.type)
                }));

                console.log('Cartas processadas:', processedCards);
                setCards(processedCards);
                if (processedCards.length > 0) {
                    setSelectedCard(processedCards[0]);
                }
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMessage = { type: 'user', content: message.trim() };
        setMessages(prev => [...prev, userMessage]);
        setHasMessages(true);
        setMessage('');
        setIsLoading(true);

        try {
            let response;
            if (conversationId) {
                // Continua conversa existente
                response = await ApiService.continueInteraction(conversationId, message.trim());
            } else {
                // Inicia nova conversa
                response = await ApiService.startNewInteraction(message.trim());
            }

            // Processa a resposta usando processApiResponse
            processApiResponse(response);

        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                type: 'error',
                content: 'Desculpe, ocorreu um erro ao processar sua mensagem.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConversationHistory = async (id) => {
        try {
            const response = await ApiService.getInteractionHistory(id);
            if (response.history) {
                const formattedMessages = response.history.map(msg => ({
                    type: msg.role === 'assistant' ? 'ai' : 'user',
                    content: msg.content,
                    timestamp: new Date(msg.timestamp)
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error fetching conversation history:', error);
        }
    };

    const handleCardSelect = (card) => {
        setSelectedCard(card);
    };

    return (
        <Box sx={{ display: 'flex', height: '100vh', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <div className="writing-environment-container virgil-chat">
                    {/* Cards Section */}
                    <div className="cards-section">
                        {/* Área Superior - Carta Selecionada */}
                        <div className="selected-card-area">
                            {selectedCard && <FlipCard card={selectedCard} />}
                        </div>

                        {/* Área Inferior - Deck de Cartas */}
                        <div className="cards-deck">
                            <div className="cards-container">
                                <div className="cards-list">
                                    {cards.map((card, index) => (
                                        <Card 
                                            key={index}
                                            onClick={() => handleCardSelect(card)}
                                            sx={{ 
                                                width: { 
                                                    xs: '100px',
                                                    sm: '120px',
                                                    md: '140px',
                                                    lg: '150px'
                                                },
                                                height: { 
                                                    xs: '140px',
                                                    sm: '170px',
                                                    md: '200px',
                                                    lg: '215px'
                                                },
                                                bgcolor: card.Type === 'WORLD' ? '#D8F651' : '#6600D2',
                                                color: card.Type === 'WORLD' ? 'black' : 'white',
                                                cursor: 'pointer',
                                                p: 0,
                                                transition: 'all 0.2s ease-in-out',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)'
                                                },
                                                border: selectedCard === card ? '2px solid white' : 'none',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                padding: { 
                                                    xs: '2.25px 8px 8px 8px',
                                                    sm: '2.5px 10px 10px 10px',
                                                    md: '2.75px 12px 12px 12px'
                                                },
                                                
                                                borderRadius: '6.02px'
                                            }}
                                        >
                                            <Box sx={{ 
                                                
                                                
                                            }}>
                                                <Typography 
                                                    variant="subtitle2" 
                                                    sx={{ 
                                                        fontFamily: 'PixelSplitter',
                                                        fontSize: { 
                                                            xs: '0.4rem',
                                                            sm: '0.5rem',
                                                            md: '0.6rem',
                                                            lg: '0.7rem'
                                                        },
                                                        lineHeight: 1.2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {`${card.Type}`}
                                                </Typography>
                                            </Box>
                                            <Box
                                                component="img"
                                                src={card.imageUrl}
                                                alt={card.Name}
                                                sx={{ 
                                                    width: '100%',
                                                    height: { 
                                                        xs: '90px',
                                                        sm: '120px',
                                                        md: '140px',
                                                        lg: '160px'
                                                    },
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                            <Box sx={{ 
                                                p: { xs: 0.5, sm: 1 },
                                                mt: { xs: 0.5, sm: 1 }
                                            }}>
                                                <Typography 
                                                    variant="subtitle2" 
                                                    sx={{ 
                                                        fontFamily: 'PixelSplitter',
                                                        fontSize: { 
                                                            xs: '0.6rem',
                                                            sm: '0.7rem',
                                                            md: '0.8rem',
                                                            lg: '0.9rem'
                                                        },
                                                        lineHeight: 1.2,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical'
                                                    }}
                                                >
                                                    {`${card.Name}`}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="chat-section">
                        <div className="chat-container">
                            <div className="chat">
                                {!hasMessages && (
                                    <div className="initial-message">
                                        <h2>CHAT WITH VIRGIL</h2>
                                        <p>Talk with Virgil to obtain insights and feedbacks based on your messages.</p>
                                    </div>
                                )}
                                
                                <div className="chat-messages" ref={chatMessagesRef}>
                                    {messages.map((msg, index) => (
                                        <div key={index} className={`message ${msg.type}`}>
                                            <div className="chatTalker">
                                                <img 
                                                    className="virgilImg" 
                                                    alt={msg.type === 'ai' ? 'Virgil' : username} 
                                                    src={msg.type === 'ai' ? "/assets/virgil-chat/virgilPictureTopLeft.svg" : "/assets/virgil-chat/userPictureDefault.svg"} 
                                                />
                                                <p>{msg.type === 'ai' ? 'VIRGIL' : username?.toUpperCase()}</p>
                                            </div>
                                            <div className="message-content">
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="message ai loading-message">
                                            <div className="chatTalker">
                                                <img className="virgilImg" alt="Virgil" src="/assets/virgil-chat/virgilPictureTopLeft.svg" />
                                                <p>VIRGIL</p>
                                            </div>
                                            <div className="message-content typing">
                                                <span className="dot"></span>
                                                <span className="dot"></span>
                                                <span className="dot"></span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="messageInput">
                                    <form onSubmit={handleSubmit}>
                                        <textarea
                                            type="text"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            disabled={isLoading}
                                        />
                                        <button type="submit" disabled={isLoading}>
                                            {isLoading ? 'Sending...' : (
                                            <>
                                                <img src="/assets/virgil-chat/sendButton.svg" alt="Send" />
                                            </>)}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Stats */}
                    <div className="right-section">
                        <h2>STORY STATS</h2>
                        <div className="statsContainer">
                            <div className="writingPoints">
                                <p>WRITING POINTS</p>
                                <div className="starContainer">
                                    <img src="/assets/virgil-chat/star.svg" alt="Star" />
                                    <p>0</p>
                                </div>
                            </div>
                            <div className="writerLevel">
                                <p>LEVEL 1</p>
                                <p>BEGINNER STORYTELLER</p>
                            </div>
                            <div className="writingSteps">
                                {/* This section will be used later */}
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Box>
    );
};

export default VirgilChat;
