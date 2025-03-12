from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from datetime import datetime
import os
from extensions import db

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")
socketio = SocketIO(app, cors_allowed_origins="*")

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize extensions
db.init_app(app)

# Import models after db initialization
from models import ChatMessage

# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    # Send last 50 messages as chat history
    messages = ChatMessage.query.order_by(ChatMessage.created_at.desc()).limit(50).all()
    emit('chat_history', [msg.to_dict() for msg in messages])

@socketio.on('new_message')
def handle_message(data):
    message = ChatMessage(
        user_name=data.get('user_name', 'Anonymous'),
        message=data['message']
    )
    db.session.add(message)
    db.session.commit()
    emit('chat_message', message.to_dict(), broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)