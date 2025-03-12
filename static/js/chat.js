class ChatBubble {
    constructor() {
        this.chatBubble = document.getElementById('chatBubble');
        this.chatMessages = document.getElementById('chatMessages');
        this.userNameInput = document.getElementById('userNameInput');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendMessage');
        this.minimizeButton = document.getElementById('minimizeChat');

        this.setupEventListeners();
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

    sendMessage() {
        const message = this.messageInput.value.trim();
        const userName = this.userNameInput.value.trim() || 'You';

        if (message) {
            this.addMessage(userName, message);
            this.messageInput.value = '';

            // Simulate response
            setTimeout(() => {
                this.addMessage('Support', 'Thanks for your message! This is a demo response.');
            }, 1000);
        }
    }

    addMessage(userName, message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message';
        messageDiv.innerHTML = `
            <span class="user-name">${userName}:</span>
            <span class="message">${message}</span>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatBubble();
});