from datetime import datetime
from extensions import db

class GameScore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_score = db.Column(db.Integer, nullable=False)
    ai_score = db.Column(db.Integer, nullable=False)
    duration = db.Column(db.Integer)  # Game duration in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'player_score': self.player_score,
            'ai_score': self.ai_score,
            'duration': self.duration,
            'created_at': self.created_at.isoformat()
        }
