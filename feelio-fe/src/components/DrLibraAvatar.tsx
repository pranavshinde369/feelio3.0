import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float } from "@react-three/drei";
import { Suspense } from "react";
import AvatarModel from "./AvatarModel";

interface DrLibraAvatarProps {
  isThinking: boolean;
  isSpeaking: boolean;
}

const DrLibraAvatar = ({ isThinking, isSpeaking }: DrLibraAvatarProps) => {
  return (
    <div className="relative h-full w-full">
      {/* Thinking Indicator */}
      {isThinking && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
            <div className="flex gap-1">
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={null}>
          {/* Ambient lighting */}
          <ambientLight intensity={0.4} />
          
          {/* Key light - main illumination */}
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1} 
            color="#2dd4bf"
          />
          
          {/* Fill light - softer secondary */}
          <directionalLight 
            position={[-5, 3, 3]} 
            intensity={0.5} 
            color="#8b5cf6"
          />
          
          {/* Rim light - edge definition */}
          <pointLight 
            position={[0, 5, -5]} 
            intensity={0.8} 
            color="#a78bfa"
          />

          <Float
            speed={isSpeaking ? 3 : 1.5}
            rotationIntensity={isSpeaking ? 0.3 : 0.1}
            floatIntensity={isSpeaking ? 0.5 : 0.3}
          >
            <AvatarModel isSpeaking={isSpeaking} isThinking={isThinking} />
          </Float>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.8}
          />
        </Suspense>
      </Canvas>

      {/* Speaking indicator glow */}
      {isSpeaking && (
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow: "inset 0 0 60px hsl(var(--feelio-teal) / 0.2)",
          }}
        />
      )}
    </div>
  );
};

export default DrLibraAvatar;
