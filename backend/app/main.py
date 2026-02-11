import json
from typing import Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from elevenlabs import ElevenLabs

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


def _get_eleven_client() -> Optional[ElevenLabs]:
    """
    Lazily initialise the ElevenLabs client.
    Returns None if the API key is not configured so the
    rest of the flow can still function without audio.
    """
    api_key = settings.ELEVENLABS_API_KEY
    if not api_key:
        return None
    return ElevenLabs(api_key=api_key)


@app.websocket("/ws/session/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await websocket.accept()
    memory = SessionMemory()
    eleven_client = _get_eleven_client()

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
                await websocket.send_json(
                    {
                        "type": "crisis",
                        "text": safety_check["response"],
                    }
                )
                # We do NOT add crisis text to memory to avoid poisoning the context
                continue

            # 3. Parallel Execution: RAG Retrieval
            # We fetch context while we set up the LLM stream
            rag_context = await rag.retrieve(user_text)

            # 4. Generate full LLM response text (Listen -> Think)
            full_response = ""
            async for token in generate_response(
                user_text, emotion, rag_context, memory.get_context()
            ):
                full_response += token

            # 5. Update Memory
            memory.add("user", user_text)
            memory.add("assistant", full_response)

            # 6. Notify frontend that AI is about to speak and provide subtitles
            await websocket.send_json({"type": "audio_start"})
            await websocket.send_json(
                {
                    "type": "subtitles",
                    "text": full_response,
                }
            )

            # 7. Stream ElevenLabs audio bytes over the WebSocket (Speak)
            if eleven_client:
                try:
                    audio_stream = eleven_client.generate(
                        text=full_response,
                        voice=settings.ELEVENLABS_VOICE_ID,
                        model="eleven_turbo_v2",
                        stream=True,
                    )

                    for chunk in audio_stream:
                        if isinstance(chunk, bytes):
                            await websocket.send_bytes(chunk)
                except Exception as e:
                    # Log and surface a soft error; text subtitles will still show
                    print(f"Error while streaming ElevenLabs audio: {e}")
                    await websocket.send_json(
                        {
                            "type": "error",
                            "message": "Failed to generate audio for this turn.",
                        }
                    )
            else:
                # If audio is not configured, at least send a clear signal
                await websocket.send_json(
                    {
                        "type": "error",
                        "message": "ELEVENLABS_API_KEY is not configured on the server.",
                    }
                )

            # 8. Mark end of this audio turn
            await websocket.send_json({"type": "audio_end"})

    except WebSocketDisconnect:
        print(f"Client {client_id} disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()