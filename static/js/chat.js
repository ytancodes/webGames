class Chat {
    constructor() {
        this.socket = io();
        this.chatBubble = document.getElementById('chatBubble');
        this.chatMessages = document.getElementById('chatMessages');
        this.userNameInput = document.getElementById('userNameInput');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendMessage');
        this.minimizeButton = document.getElementById('minimizeChat');

        this.setupEventListeners();
        this.setupSocketListeners();
    }

    setupEventListeners() {
        // Minimize/Maximize chat
        this.minimizeButton.addEventListener('click', () => {
            this.chatBubble.classList.toggle('minimized');
            this.minimizeButton.textContent = this.chatBubble.classList.contains('minimized') ? '+' : '_';
        });

        // Send message on button click
        this.sendButton.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    setupSocketListeners() {
        // Handle connection
        this.socket.on('connect', () => {
            console.log('Connected to chat server');
        });

        // Handle chat history
        this.socket.on('chat_history', (messages) => {
            messages.reverse().forEach(msg => this.addMessageToChat(msg));
        });

        // Handle new messages
        this.socket.on('chat_message', (msg) => {
            this.addMessageToChat(msg);
        });
    }

    sendMessage() {
        const message = this.messageInput.value.trim();
        const userName = this.userNameInput.value.trim() || 'Anonymous';

        if (message) {
            this.socket.emit('new_message', {
                user_name: userName,
                message: message
            });
            this.messageInput.value = '';
        }
    }

    addMessageToChat(msg) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        
        const time = new Date(msg.created_at).toLocaleTimeString();
        messageDiv.innerHTML = `
            <span class="user-name">${msg.user_name}:</span>
            <span class="message">${msg.message}</span>
            <span class="timestamp">${time}</span>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Chat();
});
