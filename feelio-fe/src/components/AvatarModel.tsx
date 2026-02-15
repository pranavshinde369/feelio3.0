import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AvatarModelProps {
  isSpeaking: boolean;
  isThinking: boolean;
}

const AvatarModel = ({ isSpeaking, isThinking }: AvatarModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Subtle breathing animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    }

    // Eye blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkCycle = Math.sin(time * 0.3) > 0.95;
      const scaleY = blinkCycle ? 0.1 : 1;
      leftEyeRef.current.scale.y = THREE.MathUtils.lerp(leftEyeRef.current.scale.y, scaleY, 0.3);
      rightEyeRef.current.scale.y = THREE.MathUtils.lerp(rightEyeRef.current.scale.y, scaleY, 0.3);
    }

    // Speaking animation - mouth movement
    if (mouthRef.current) {
      if (isSpeaking) {
        const speakScale = 0.8 + Math.sin(time * 15) * 0.3;
        mouthRef.current.scale.y = speakScale;
      } else {
        mouthRef.current.scale.y = THREE.MathUtils.lerp(mouthRef.current.scale.y, 0.6, 0.1);
      }
    }

    // Thinking animation - slight head tilt
    if (headRef.current && isThinking) {
      headRef.current.rotation.z = Math.sin(time * 2) * 0.05;
    } else if (headRef.current) {
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, 0, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Head */}
      <mesh ref={headRef}>
        {/* Face base - rounded rectangle-ish sphere */}
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh position={[0, 0, 0.1]}>
        <torusGeometry args={[1.0, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color="#2dd4bf" 
          emissive="#2dd4bf"
          emissiveIntensity={isSpeaking ? 1 : 0.5}
          roughness={0.2}
        />
      </mesh>

      {/* Left Eye */}
      <mesh ref={leftEyeRef} position={[-0.4, 0.2, 1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#2dd4bf"
          emissive="#2dd4bf"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Right Eye */}
      <mesh ref={rightEyeRef} position={[0.4, 0.2, 1]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#2dd4bf"
          emissive="#2dd4bf"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, -0.35, 1]}>
        <capsuleGeometry args={[0.08, 0.3, 8, 16]} />
        <meshStandardMaterial 
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={isSpeaking ? 0.8 : 0.3}
        />
      </mesh>

      {/* Decorative elements - "neural" patterns */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * 0.8;
        const y = Math.sin(angle) * 0.8;
        return (
          <mesh key={i} position={[x, y, 0.5]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color="#a78bfa"
              emissive="#a78bfa"
              emissiveIntensity={0.5}
            />
          </mesh>
        );
      })}

      {/* Neck/Body hint */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.4, 0.6, 1, 16]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.4}
        />
      </mesh>

      {/* Shoulders hint */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[2, 0.5, 0.8]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          roughness={0.4}
        />
      </mesh>
    </group>
  );
};

export default AvatarModel;
