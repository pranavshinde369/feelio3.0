import os
# ▼▼▼ CORRECT IMPORTS ▼▼▼
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings

class RAGSystem:
    def __init__(self):
        # 1. Initialize Embeddings (Gemini)
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=settings.GOOGLE_API_KEY
        )
        
        # 2. Initialize Vector DB (Chroma)
        # We ensure the directory exists to avoid errors
        os.makedirs(settings.CHROMA_PATH, exist_ok=True)
        
        self.db = Chroma(
            persist_directory=settings.CHROMA_PATH,
            embedding_function=self.embeddings
        )

    async def retrieve(self, query: str, k: int = 3) -> str:
        """
        Async retrieval of therapeutic context.
        """
        if not query:
            return ""
            
        try:
            # We use the sync method in a way that doesn't crash async loops
            # (Chroma's async support is still experimental in some versions)
            docs = self.db.similarity_search(query, k=k)
            context = "\n".join([d.page_content for d in docs])
            return context
        except Exception as e:
            print(f"RAG Error: {e}")
            return "General supportive therapy principles."

# ▼▼▼ INSTANTIATE THE SYSTEM ▼▼▼
rag = RAGSystem()