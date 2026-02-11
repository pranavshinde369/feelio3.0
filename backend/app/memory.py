from collections import deque

class SessionMemory:
    def __init__(self, max_turns: int = 5):
        # Deque automatically discards old items when full
        self.history = deque(maxlen=max_turns) 

    def add(self, role: str, content: str):
        self.history.append({"role": role, "content": content})

    def get_context(self) -> list:
        return list(self.history)

# In a real app, you'd use a dict {session_id: SessionMemory()}
# For this demo, we can instantiate per websocket connection.