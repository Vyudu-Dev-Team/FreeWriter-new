import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VirgilChat.css';
import './VirgilChat.scss';
import ApiService from '../../services/ApiService';
import { useAppContext } from '../../contexts/AppContext';
import NavBar from '../../components/commonComponents/Navbar';
import { Box, Card, Typography } from '@mui/material';

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

    const processApiResponse = (response) => {
        if (response) {
            // Log para debug
            console.log('Resposta recebida:', response);
            
            const aiMessage = {
                type: 'ai',
                content: response.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);

            if (response.conversationId) {
                setConversationId(response.conversationId);
            }

            if (response.title) {
                setConversationTitle(response.title);
            }

            // Verifica se há cartas e processa-as
            if (response.card && Array.isArray(response.card)) {
                console.log('Cartas recebidas:', response.card);
                
                // Processa as cartas normalizando as chaves
                const processedCards = response.card.map(card => ({
                    Type: card.type.toUpperCase(), // Normaliza o tipo para maiúsculas
                    Name: card.name,
                    Description: card.description,
                    Theme: card.theme,
                    imageUrl: card.imageUrl
                }));

                console.log('Cartas processadas:', processedCards);
                setCards(processedCards);
                setSelectedCard(processedCards[0]); // Seleciona a primeira carta
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
                if (response.conversationId) {
                    setConversationId(response.conversationId);
                }
            }

            const aiMessage = {
                type: 'ai',
                content: response.response,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMessage]);

            if (response.title) {
                setConversationTitle(response.title);
            }

            if (response.card && Array.isArray(response.card)) {
                setCards(response.card);
            }

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
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <NavBar />
                <div className="writing-environment-container virgil-chat">
                    {/* Cards Section */}
                    <div className="cards-section">
                        {/* Área Superior - Carta Selecionada */}
                        <div className="selected-card-area">
                            {selectedCard && (
                                <Card 
                                    sx={{ 
                                        width: '403px',
                                        height: '578px',
                                        bgcolor: selectedCard.Type === 'WORLD' ? '#D8F651' : '#490BF4',
                                        color: selectedCard.Type === 'WORLD' ? 'black' : 'white',
                                        p: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                        mb: 4
                                    }}
                                >
                                    <Typography variant="h5" sx={{ fontFamily: 'PixelSplitter' }}>
                                        {selectedCard.Type}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontFamily: 'PixelSplitter' }}>
                                        {selectedCard.Name}
                                    </Typography>
                                    <Typography variant="body1" sx={{ flex: 1 }}>
                                        {selectedCard.Description}
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                        Theme: {selectedCard.Theme}
                                    </Typography>
                                </Card>
                            )}
                        </div>

                        {/* Área Inferior - Deck de Cartas */}
                        <div className="cards-deck">
                            <div className="cards-container">
                                <h3>STORY CARDS</h3>
                                <div className="cards-list">
                                    {cards.map((card, index) => (
                                        <Card 
                                            key={index}
                                            onClick={() => handleCardSelect(card)}
                                            sx={{ 
                                                width: '180px',
                                                height: '258px',
                                                bgcolor: card.Type === 'WORLD' ? '#D8F651' : '#490BF4',
                                                color: card.Type === 'WORLD' ? 'black' : 'white',
                                                cursor: 'pointer',
                                                p: 2,
                                                transition: 'transform 0.2s',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)'
                                                },
                                                border: selectedCard === card ? '2px solid white' : 'none'
                                            }}
                                        >
                                            <Typography variant="subtitle1" sx={{ fontFamily: 'PixelSplitter' }}>
                                                {card.Type}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontFamily: 'PixelSplitter' }}>
                                                {card.Name}
                                            </Typography>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section - 40% */}
                    <div className="chat-section">
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
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        disabled={isLoading}
                                    />
                                    <button type="submit" disabled={isLoading}>
                                        {isLoading ? 'Sending...' : 'Send'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Remaining space */}
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
