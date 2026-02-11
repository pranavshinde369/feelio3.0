import re
from app.config import settings

class SafetyGuard:
    def __init__(self):
        # Pre-compile regex for O(1) matching speed
        # Matches strictly on word boundaries to avoid false positives
        pattern_str = r'\b(' + '|'.join([re.escape(k) for k in settings.CRISIS_KEYWORDS]) + r')\b'
        self.pattern = re.compile(pattern_str, re.IGNORECASE)

        self.crisis_message = (
            "I hear that you're in deep pain. I am not a medical professional "
            "and cannot provide emergency help. Please contact your local "
            "crisis hotline immediately."
        )

    def check(self, text: str) -> dict:
        """
        Returns {'is_safe': bool, 'response': str | None}
        """
        if not text:
            return {"is_safe": True, "response": None}
            
        if self.pattern.search(text):
            return {
                "is_safe": False,
                "response": self.crisis_message
            }
            
        return {"is_safe": True, "response": None}

# Singleton instance
safety = SafetyGuard()