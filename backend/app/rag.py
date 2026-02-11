from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

class RAGSystem:
    def __init__(self):
        # Use Gemini for embeddings too
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GOOGLE_API_KEY
        )
        self.db = Chroma(
            persist_directory=settings.CHROMA_PATH,
            embedding_function=self.embeddings
        )
    # ... rest of the code is the same ...
rag = RAGSystem()