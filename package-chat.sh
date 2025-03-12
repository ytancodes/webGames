#!/bin/bash

# Create directories if they don't exist
mkdir -p chat-bubble/static/css
mkdir -p chat-bubble/static/js

# Copy files
cp chat-demo.html chat-bubble/
cp static/css/chat.css chat-bubble/static/css/
cp static/js/chat.js chat-bubble/static/js/
cp README.md chat-bubble/

# Create zip file
zip -r chat-bubble.zip chat-bubble/

# Clean up
rm -rf chat-bubble/

echo "Created chat-bubble.zip with all chat-related files"
