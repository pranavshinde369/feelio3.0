import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.safety import safety
from app.rag import rag
from app.llm import generate_response
from app.memory import SessionMemory

app = FastAPI(title="Therapy AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.websocket("/ws/session/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    memory = SessionMemory()
    
    try:
        while True:
            # 1. Receive JSON from Frontend
            data = await websocket.receive_text()
            payload = json.loads(data)
            
            user_text = payload.get("text", "")
            emotion = payload.get("emotion", "Neutral")
            
            # 2. Safety Check (Deterministic - Zero Latency)
            # If this triggers, we stop immediately.
            safety_check = safety.check(user_text)
            if not safety_check["is_safe"]:
                await websocket.send_json({
                    "type": "crisis",
                    "text": safety_check["response"]
                })
                # We do NOT add crisis text to memory to avoid poisoning the context
                continue 

            # 3. Parallel Execution: RAG Retrieval
            # We fetch context while we set up the LLM stream
            rag_context = await rag.retrieve(user_text)
            
            # 4. Stream LLM Response
            await websocket.send_json({"type": "stream_start"})
            
            full_response = ""
            
            # This loops yields tokens as they are generated
            async for token in generate_response(
                user_text, emotion, rag_context, memory.get_context()
            ):
                full_response += token
                
                # Send token to frontend (for text display)
                await websocket.send_json({
                    "type": "token",
                    "content": token
                })
                
                # OPTIONAL: Send token to ElevenLabs WebSocket here if doing server-side TTS
                # (For simplicity, we assume frontend handles TTS or we send chunks)

            # 5. Update Memory
            memory.add("user", user_text)
            memory.add("assistant", full_response)
            
            await websocket.send_json({"type": "stream_end"})

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()