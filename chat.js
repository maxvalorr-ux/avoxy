// Gemini AI Chat Support
const GEMINI_API_KEY = 'AIzaSyDW3G_-XuqlxHpMGMlP4Ts-kt8gWFjTeIU';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

let chatHistory = [];

function openSupportChat() {
    const chat = document.getElementById('supportChat');
    if (chat) {
        chat.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Focus on input
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) input.focus();
        }, 300);
    }
}

function closeSupportChat() {
    const chat = document.getElementById('supportChat');
    if (chat) {
        chat.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function handleChatKeyPress(event) {
    if (event.key === 'Enter') {
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const messagesContainer = document.getElementById('chatMessages');
    
    if (!input || !input.value.trim()) return;
    
    const userMessage = input.value.trim();
    input.value = '';
    
    // Add user message to chat
    addMessageToChat(userMessage, 'user');
    
    // Show typing indicator
    const typingIndicator = addTypingIndicator();
    
    try {
        // Prepare context for Gemini
        const context = `You are a helpful support assistant for Avox Hosting, a game server hosting company. 
        You help customers with questions about SAMP, MTA, and Minecraft server hosting. 
        Be friendly, professional, and concise. If you don't know something, suggest contacting support.`;
        
        // Call Gemini API
        // Using gemini-2.0-flash as requested
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${context}\n\nUser: ${userMessage}\nAssistant:`
                    }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            throw new Error(`API request failed: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Remove typing indicator
        if (typingIndicator) typingIndicator.remove();
        
        // Extract response text
        let botResponse = 'I apologize, but I encountered an error. Please try again or contact our support team.';
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            botResponse = data.candidates[0].content.parts[0].text;
        }
        
        // Add bot response to chat
        addMessageToChat(botResponse, 'bot');
        
        // Update chat history
        chatHistory.push({ role: 'user', text: userMessage });
        chatHistory.push({ role: 'bot', text: botResponse });
        
    } catch (error) {
        console.error('Chat error:', error);
        
        // Remove typing indicator
        if (typingIndicator) typingIndicator.remove();
        
        // Show error message
        addMessageToChat('Sorry, I\'m having trouble connecting right now. Please try again in a moment or contact our support team directly.', 'bot');
    }
}

function addMessageToChat(message, type) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${type}-message`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const textP = document.createElement('p');
    textP.textContent = message;
    
    contentDiv.appendChild(textP);
    messageDiv.appendChild(contentDiv);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
}

function addTypingIndicator() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';
    
    contentDiv.appendChild(dots);
    typingDiv.appendChild(contentDiv);
    messagesContainer.appendChild(typingDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return typingDiv;
}

// Close chat when clicking outside
document.addEventListener('click', function(event) {
    const chat = document.getElementById('supportChat');
    const chatButton = document.querySelector('.chat-button');
    
    if (chat && chat.classList.contains('active')) {
        if (!chat.contains(event.target) && !chatButton.contains(event.target)) {
            closeSupportChat();
        }
    }
});

