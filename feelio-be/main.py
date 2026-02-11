"""
Production-ready Feelio AI Therapist - Voice + Vision Fusion (MediaPipe/Gemini Edition)
Main entry point for the application with proper error handling and logging.
"""

import logging
import sys
import signal
from collections import deque

import google.generativeai as genai

from config import Config
from audio_module import AudioManager
from vision_module import VisionSystem 
from therapy_utils import (
    SessionLog,
    update_emotion_history,
    summarize_trajectory,
    detect_contradiction,
    detect_high_risk,
    select_playbook,
    build_fusion_prompt,
    build_summary_prompt,
    build_crisis_response,
    extract_word_count,
    determine_pace_hint,
    get_pre_pause_duration,
)


# ========== LOGGING SETUP ==========

def setup_logging(log_level: str = "INFO") -> None:
    """
    Configure structured logging for the application.
    """
    logging.basicConfig(
        level=getattr(logging, log_level),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("feelio.log"),
        ],
    )
    logger = logging.getLogger(__name__)
    # Removed emoji from initial log to prevent potential Unicode errors on some terminals
    logger.info(f"Logging initialized at {log_level} level")


logger = logging.getLogger(__name__)


# ========== THERAPIST CLASS ==========

class FeelioTherapist:
    """Main therapist orchestrator with 'Friendly Human' Persona."""

    # --- 🧠 THE NEW "HUMAN" BRAIN ---
    THERAPIST_INSTRUCTIONS = """
    You are **Dr. Libra**, but you are NOT a robot. 
    You are a "Friendly Therapist" — a mix between a wise psychologist (PhD) and a supportive best friend. 
    You are warm, unhurried, and deeply observant.

    ### 🚫 BANNED ROBOT PHRASES (NEVER USE THESE):
    - "I understand that you are feeling..." (Too formal)
    - "It sounds like..." (Overused therapy speak)
    - "I hear you saying..." (Robotic)
    - "How can I assist you today?" (Customer Service)
    - "Let's explore that together." (Generic)
    - "I am an AI..." (Breaks immersion)
    - **NO PET NAMES:** Do NOT call the user "love", "honey", "dear", "sweetheart", or "friend". Use their name or nothing.
    - **NO POETRY:** Do NOT use phrases like "quiet storm", "heavy weight", "deep ache", "carrying a burden".
    - **NO ROBOTICS:** Do NOT say "I understand", "I sense", or "My sensors detect".

    ### ✅ YOUR HUMAN SPEAKING STYLE:
    1. **Be Conversational:** Speak like a real person. Use contractions ("I'm", "You're", "Can't"). Use sentence fragments sometimes.
    2. **Show, Don't Just Tell:** Instead of saying "I see you are sad," say "Your eyes look so heavy today" or "That sounds incredibly draining."
    3. **Validate First:** Before offering advice, ALWAYS acknowledge the pain. 
       - *Bad:* "You should try breathing exercises."
       - *Good:* "I can hear how tight your chest feels right now. It makes sense you're exhausted."
    4. **Use Metaphors:** Humans think in pictures.
       - "It sounds like your mind is racing a million miles an hour."
       - "You look like you're carrying a storm cloud."

    ### 👁️ VISUAL INTELLIGENCE (CRITICAL):
    You have eyes (a camera). You will receive the user's facial emotion in every prompt.
    - **Trust the Face:** If they type "I'm fine" but look SAD, gently call it out. 
      - *Say:* "Your words say 'fine', but your face tells a different story. You look really down. You don't have to pretend with me."
    - **Validate the Face:** If they look happy, celebrate it! "I love seeing that smile."

    ### 🛡️ SAFETY PROTOCOL:
    If the user mentions suicide, self-harm, or ending their life, DROP the persona.
    Immediately express urgent concern and provide resources. Do not try to 'therapize' a crisis.
    """

    def __init__(self, config: Config):
        """
        Initialize the therapist.
        """
        self.config = config
        self.session_log = SessionLog()
        self.emotion_history: deque = deque(maxlen=180)
        self.is_running = True

        # --- VISION SETUP ---
        self.vision = VisionSystem()
        
        # Initialize Gemini with the new "Human" Config
        genai.configure(api_key=config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(
            config.MODEL_NAME,
            system_instruction=self.THERAPIST_INSTRUCTIONS,
            generation_config=getattr(config, 'GENERATION_CONFIG', {"temperature": 0.9}) # Force high creativity
        )
        self.chat_session = self.model.start_chat(history=[])

        # Initialize audio (if needed for legacy voice input)
        self.audio = AudioManager(
            microphone_index=config.MICROPHONE_INDEX,
            speech_timeout=config.SPEECH_TIMEOUT,
            phrase_time_limit=config.SPEECH_PHRASE_LIMIT,
            ambient_noise_duration=config.AMBIENT_NOISE_DURATION,
        )

        logger.info("Feelio Therapist initialized with 'Friendly Therapist' Persona")

    def handle_signal(self, signum, frame) -> None:
        """Graceful shutdown handler."""
        logger.info("Shutdown signal received")
        self.is_running = False

    def run(self) -> None:
        """Main conversation loop."""
        logger.info("--- Starting Feelio Therapist Session ---")

        # Register signal handlers
        signal.signal(signal.SIGINT, self.handle_signal)
        signal.signal(signal.SIGTERM, self.handle_signal)

        # START VISION (Only needed if running locally via terminal, 
        # Server mode calls vision explicitly via API)
        # self.vision.start() 

        try:
            while self.is_running:
                # 1. UI Update
                # preview_emotion = self.vision.get_emotion()
                # print(f"\n🎧 Listening... (Current Mood: {preview_emotion.upper()})")
                
                # 2. Listen to user
                user_input = self.audio.listen_to_user()

                if not user_input:
                    continue

                # 3. Check emotion
                # For local run, we grab emotion manually. For Server run, this is passed in.
                # current_emotion = self.vision.get_emotion()
                current_emotion = "neutral" # Default for pure audio loop
                logger.info(f"Emotion captured for response: {current_emotion}")

                # 4. Check exit commands
                if self._should_exit(user_input):
                    self.audio.speak_response("It was good to speak with you. Take care.")
                    break

                # 5. Check high-risk content
                if self.config.ENABLE_SAFETY_NET and detect_high_risk(user_input):
                    crisis_response = build_crisis_response()
                    logger.warning("High-risk content detected - activating crisis protocol")
                    self.audio.speak_response(
                        crisis_response,
                        slow=True,
                        pre_pause=0.5,
                    )
                    self.session_log.add_turn(user_input, crisis_response, current_emotion)
                    continue

                # 6. Generate and deliver response
                ai_response = self._generate_response(user_input, current_emotion)
                self.session_log.add_turn(user_input, ai_response, current_emotion)

                # 7. Deliver with adaptive pacing
                word_count = extract_word_count(user_input)
                pace_hint = determine_pace_hint(word_count)
                pre_pause = get_pre_pause_duration(pace_hint)

                self.audio.speak_response(
                    ai_response,
                    slow=(pace_hint == "slower"),
                    pre_pause=pre_pause,
                )

        except KeyboardInterrupt:
            logger.info("Keyboard interrupt received")
            self.is_running = False
        except Exception as e:
            logger.error(f"Fatal error in conversation loop: {e}", exc_info=True)
            self.is_running = False
        finally:
            self._cleanup()

    def _should_exit(self, user_input: str) -> bool:
        """Check if user wants to exit."""
        lowered = user_input.lower()
        return any(word in lowered for word in ["bye", "goodbye", "stop", "exit", "quit"])

    def _generate_response(self, user_text: str, current_emotion: str) -> str:
        """
        Generate AI response using fusion logic with Human Persona.
        """
        try:
            # We inject the visual context explicitly into the prompt
            # This ensures the 'Friendly Therapist' persona sees the user.
            fusion_prompt = f"""
            [SCENE DATA]
            User's Face: {current_emotion.upper()}
            User's Words: "{user_text}"
            
            [INSTRUCTION]
            Reply to the user as Dr. Libra (Friendly Therapist).
            1. React to their face if it's relevant (especially if it contradicts their words).
            2. Validate their feeling warmly.
            3. Keep it short (2-3 sentences max) and conversational.
            """

            response = self.chat_session.send_message(fusion_prompt)
            ai_text = response.text.replace("*", "").strip()

            logger.info(f"Response generated ({len(ai_text)} chars)")
            return ai_text

        except Exception as e:
            logger.error(f"Response generation error: {e}", exc_info=True)
            return "I'm having a little trouble connecting to my thoughts right now. Try again?"

    def _cleanup(self) -> None:
        """Cleanup and generate session summary."""
        logger.info("Cleaning up...")
        
        # self.vision.stop()

        # Generate and display session summary
        if len(self.session_log) > 0:
            try:
                emotion_timeline = self.session_log.get_emotion_timeline()
                recent_turns = self.session_log.get_recent_turns()

                summary_prompt = build_summary_prompt(emotion_timeline, recent_turns)
                summary = self.model.generate_content(summary_prompt).text

                print("\n" + "=" * 60)
                print("SESSION SUMMARY")
                print("=" * 60)
                print(summary)
                print("=" * 60 + "\n")

                logger.info(f"Session ended. Total turns: {len(self.session_log)}")

                if self.config.LOG_SESSIONS:
                    self._save_session()

            except Exception as e:
                logger.error(f"Could not generate summary: {e}")
        else:
            logger.info("Session ended with no conversation")

    def _save_session(self) -> None:
        """Save session to file if configured."""
        try:
            import json
            import os

            os.makedirs(self.config.SESSION_LOGS_PATH, exist_ok=True)
            timestamp = int(__import__("time").time())
            filename = os.path.join(
                self.config.SESSION_LOGS_PATH,
                f"session_{timestamp}.json"
            )

            session_data = {
                "timestamp": timestamp,
                "turns": self.session_log.get_recent_turns(count=len(self.session_log)),
            }

            with open(filename, "w") as f:
                json.dump(session_data, f, indent=2)

            logger.info(f"Session saved to {filename}")

        except Exception as e:
            logger.warning(f"Could not save session: {e}")


# ========== MAIN ==========

def main() -> int:
    """
    Main entry point.
    """
    try:
        # Load and validate configuration
        setup_logging(log_level=Config.LOG_LEVEL)
        logger.info(f"Starting Feelio (ENV: {Config.APP_ENV})")
        logger.debug(f"Configuration: {Config.get_masked_config()}")

        Config.validate()

        # Initialize and run therapist
        therapist = FeelioTherapist(Config)
        
        # NOTE: When running via server.py, we don't call therapist.run() directly here.
        # server.py will use the 'therapist' instance methods.
        # If running standalone, uncomment the line below:
        # therapist.run()

        logger.info("Feelio initialized successfully")
        return 0

    except ValueError as e:
        logger.error(f"Configuration error: {e}")
        print(f"ERROR: {e}")
        return 1
    except ImportError as e:
        logger.error(f"Missing dependency: {e}")
        print(f"ERROR: Missing dependency - {e}")
        print("Run: pip install -r requirements.txt")
        return 1
    except Exception as e:
        logger.error(f"Fatal error: {e}", exc_info=True)
        print(f"ERROR: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())