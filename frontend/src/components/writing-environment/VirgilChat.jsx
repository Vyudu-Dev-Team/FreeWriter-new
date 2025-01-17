import React, { useState } from 'react';
import './VirgilChat.css';
import './VirgilChat.scss';
import ApiService from '../../services/ApiService';

const VirgilChat = () => {
    const [message, setMessage] = useState('');
    const [hasMessages, setHasMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        try {
            setIsLoading(true);
            // Add user message to chat
            const userMessage = { type: 'user', content: message };
            setMessages(prev => [...prev, userMessage]);
            setHasMessages(true);

            // Call API
            const response = await ApiService.aiInteraction(message);
            
            // Add AI response to chat
            const aiMessage = { type: 'ai', content: response.message || response.response || 'No response received' };
            setMessages(prev => [...prev, aiMessage]);
            
            // Clear input
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            // Add error message to chat
            const errorMessage = { type: 'error', content: 'Sorry, there was an error processing your message.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="writing-environment-container virgil-chat">
            {/* Cards Section - 28% */}
            <div className="cards-section">
                <p>Talk more with Virgil to start generating your story deck.</p>
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
                    
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                {msg.type === 'ai' && (
                                    <div className="chatTalker">
                                        <img className="virgilImg" alt="Virgil" />
                                        <p>VIRGIL</p>
                                    </div>
                                )}
                                <div className="message-content">
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message ai">
                                <div className="chatTalker">
                                    <img className="virgilImg" alt="Virgil" />
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
