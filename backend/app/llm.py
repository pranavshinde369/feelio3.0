import google.generativeai as genai
from app.config import settings

# Configure the SDK once
genai.configure(api_key=settings.GOOGLE_API_KEY)

# Initialize the model with specific safety settings for therapy
# We lower the block threshold slightly so it can discuss difficult topics (like sadness) 
# without triggering a refusal, while still blocking hate speech.
safety_settings = [
    {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_ONLY_HIGH"},
    {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_ONLY_HIGH"},
    {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_ONLY_HIGH"},
    {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_ONLY_HIGH"},
]

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    safety_settings=safety_settings
)

async def generate_response(
    user_text: str, 
    emotion: str, 
    rag_context: str, 
    history: list
):
    # 1. Construct the System Prompt
    system_instruction = f"""
    You are a compassionate CBT therapist.
    
    CURRENT USER STATE:
    - Visible Emotion: {emotion}
    - Detected Distress: {"High" if emotion in ["Sadness", "Anxiety"] else "Moderate"}
    
    THERAPEUTIC CONTEXT (Use this to guide advice):
    {rag_context}
    
    GUIDELINES:
    1. Acknowledge the emotion gently first.
    2. Be calm, not clinical or preachy.
    3. Keep it under 150 words.
    4. Do not provide medical diagnoses.
    """

    # 2. Format History for Gemini (User/Model roles)
    # Gemini expects: [{'role': 'user', 'parts': [...]}, {'role': 'model', 'parts': [...]}]
    chat_history = []
    for msg in history:
        role = "user" if msg["role"] == "user" else "model"
        chat_history.append({"role": role, "parts": [msg["content"]]})

    # 3. Start Chat Session
    chat = model.start_chat(history=chat_history)
    
    # 4. Send Message & Stream
    # We combine system prompt + user text for the current turn to ensure strict adherence
    full_prompt = f"SYSTEM_INSTRUCTION: {system_instruction}\n\nUSER_INPUT: {user_text}"
    
    response_stream = await chat.send_message_async(full_prompt, stream=True)

    async for chunk in response_stream:
        if chunk.text:
            yield chunk.text