from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask
app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET")
socketio = SocketIO(app, cors_allowed_origins="*")

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Import db after app configuration
from extensions import db
db.init_app(app)

# Import models after db initialization
from models import GameScore, ChatMessage

# Create tables
with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scores', methods=['GET'])
def get_scores():
    scores = GameScore.query.order_by(GameScore.created_at.desc()).limit(10).all()
    return jsonify([score.to_dict() for score in scores])

@app.route('/scores', methods=['POST'])
def save_score():
    data = request.get_json()
    new_score = GameScore(
        player_score=data['player_score'],
        ai_score=data['ai_score'],
        duration=data.get('duration')
    )
    db.session.add(new_score)
    db.session.commit()
    return jsonify(new_score.to_dict()), 201

# Chat WebSocket events
@socketio.on('connect')
def handle_connect():
    # Load last 50 messages
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