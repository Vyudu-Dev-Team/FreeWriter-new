import React, { useState } from 'react';
import './VirgilChat.css';

const VirgilChat = () => {
    const [message, setMessage] = useState('');
    const [hasMessages, setHasMessages] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        try {
            const response = await fetch('/functions/api/ai/interaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setHasMessages(true);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="writing-environment-container">
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
                    
                    <div className="chatTalker">
                        <img className="virgilImg" alt="Virgil" />
                        <p>VIRGIL</p>
                    </div>

                    <div className="messageInput">
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                            />
                            <button type="submit">Send</button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right Section - Remaining space */}
            <div className="right-section">
                {/* This section will be used later */}
            </div>
        </div>
    );
};

export default VirgilChat;
