import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './VirgilChat.css';
import './VirgilChat.scss';
import ApiService from '../../services/ApiService';
import { useAppContext } from '../../contexts/AppContext';

const VirgilChat = () => {
    const [message, setMessage] = useState('');
    const [hasMessages, setHasMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cards, setCards] = useState([]);
    const [conversationId, setConversationId] = useState(null);
    const [conversationTitle, setConversationTitle] = useState('');
    const chatMessagesRef = useRef(null);
    const navigate = useNavigate();
    const { state } = useAppContext();
    const username = state?.user?.user?.username || '';

    useEffect(() => {
        console.log('Current user state:', state?.user);
        fetchChatHistory();
    }, []);

    const fetchChatHistory = async () => {
        try {
            const response = await ApiService.aiInteraction();
            if (response) {
                processApiResponse(response, true);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
            if (error.message.includes('Unauthorized')) {
                navigate('/login');
            }
        }
    };

    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processApiResponse = (response, isHistory = false) => {
        try {
            if (isHistory && response?.conversation?.history) {
                const formattedMessages = response.conversation.history.map(msg => ({
                    type: msg.role === 'user' ? 'user' : 'ai',
                    content: msg.content,
                    timestamp: new Date(msg.timestamp)
                }));
                
                setMessages(formattedMessages);
                setHasMessages(formattedMessages.length > 0);
                
                if (response.conversation._id) {
                    setConversationId(response.conversation._id);
                }
            } else {
                // Process new message response
                if (response.response) {
                    const newMessage = {
                        type: 'ai',
                        content: response.response,
                        timestamp: new Date()
                    };
                    setMessages(prev => [...prev, newMessage]);
                }

                // Update conversation ID if provided
                if (response.conversationId) {
                    setConversationId(response.conversationId);
                }

                // Update title if provided
                if (response.title) {
                    setConversationTitle(response.title);
                }

                // Update cards if provided
                if (response.card && Array.isArray(response.card)) {
                    setCards(response.card);
                }
            }
        } catch (error) {
            console.error('Error processing API response:', error);
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
            const response = await ApiService.aiInteraction(message);
            processApiResponse(response);
        } catch (error) {
            console.error('Error sending message:', error);
            
            if (error.message.includes('Unauthorized')) {
                navigate('/login');
                return;
            }
            
            const errorMessage = { 
                type: 'error', 
                content: error.message === 'Unauthorized: Please log in again' 
                    ? 'Your session has expired. Please log in again.' 
                    : 'Sorry, there was an error processing your message.' 
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="writing-environment-container virgil-chat">
            {/* Cards Section - 28% */}
            <div className="cards-section">
                {cards.length > 0 ? (
                    <div className="cards-container">
                        <h3>STORY CARDS</h3>
                        <div className="cards-list">
                            {cards.map((card, index) => (
                                <div key={index} className="story-card">
                                    {card}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Talk more with Virgil to start generating your story deck.</p>
                )}
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
    );
};

export default VirgilChat;
