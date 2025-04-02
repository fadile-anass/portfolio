import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Load chat history from localStorage when component mounts
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbotMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Set default welcome message if no history exists
      setMessages([
        { role: 'assistant', content: 'Hi there! I\'m the AI version of Fadile Anass. Feel free to ask me anything about my skills, projects, or experience!' }
      ]);
    };
    
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbotMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to the bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  useEffect(() => {
    // Show tooltip after a short delay when component mounts
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true);
    }, 1000);

    // Hide tooltip after 5 seconds
    const hideTooltipTimer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);

    return () => {
      clearTimeout(tooltipTimer);
      clearTimeout(hideTooltipTimer);
    };
  }, []);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    setShowTooltip(false);  // Hide tooltip when chat is opened
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call your AI API here
      const response = await fetchAIResponse(input, messages);
      
      // Add AI response to chat
      const aiMessage = { role: 'assistant', content: response };
      setMessages(prevMessages => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // Modified to include conversation history in API call
  const fetchAIResponse = async (userMessage, conversationHistory) => {
    const apiUrl = process.env.REACT_APP_AI_API_URL;
    const apiKey = process.env.REACT_APP_AI_API_KEY;
    
    // Import your system prompt
    const systemPrompt = await import('../../utils/systemPrompt').then(module => module.default);
    
    // Prepare conversation history for API call
    // Only include the last 10 messages to avoid token limits
    const recentMessages = conversationHistory.slice(-10);
    
    // Format messages for the API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...recentMessages.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: userMessage }
    ];
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // or whichever model you're using
        messages: apiMessages,
        max_tokens: 500,
        temperature: 0.7
      })
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to fetch AI response');
    }
    
    return data.choices[0].message.content;
  };

  // Add a button to clear chat history
  const clearChatHistory = () => {
    localStorage.removeItem('chatbotMessages');
    setMessages([
      { role: 'assistant', content: 'Chat history has been cleared. How can I help you today?' }
    ]);
  };

  return (
    <div className="chatbot-container">
    <button 
      className="chatbot-toggle"
      onClick={toggleChatbot}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )}
      <div className={`chatbot-tooltip ${showTooltip ? 'show' : ''}`}>
        Chat with me!
      </div>
    </button>

      {/* Chatbot dialog */}
      {isOpen && (
        <div className="chatbot-dialog">
          <div className="chatbot-header">
            <h3>Chat with Anass Fadile's AI</h3>
            <div className="chatbot-header-buttons">
              <button 
                onClick={clearChatHistory}
                aria-label="Clear chat history"
                className="clear-history-button"
                title="Clear chat history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button 
                onClick={toggleChatbot}
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={message.role === 'user' ? 'user-message message' : 'assistant-message message'}
              >
                <div className="message-content">
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="assistant-message message">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="chatbot-input">
            <div className="input-container">
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
              />
              <button 
                onClick={sendMessage}
                disabled={isLoading || input.trim() === ''}
                className={isLoading || input.trim() === '' ? 'send-button-disabled' : 'send-button-enabled'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;