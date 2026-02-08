import { Suspense, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, Sparkles, MeshDistortMaterial } from "@react-three/drei";
import { Leaf, Droplets, Sun, Sparkles as SparklesIcon, Wind } from "lucide-react";
import * as THREE from "three";

// Beautiful Bonsai-style Tree
const HealingTree = () => {
  const treeRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (treeRef.current) {
      treeRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
    }
  });

  return (
    <Float speed={0.4} rotationIntensity={0.02} floatIntensity={0.05}>
      <group ref={treeRef} position={[0, -0.3, 0]}>
        {/* Main trunk */}
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.14, 1.2, 12]} />
          <meshStandardMaterial color="#4A3728" roughness={0.9} />
        </mesh>
        
        {/* Branch 1 */}
        <mesh position={[0.2, 1.1, 0]} rotation={[0, 0, -0.4]}>
          <cylinderGeometry args={[0.03, 0.05, 0.5, 8]} />
          <meshStandardMaterial color="#5D4A3A" roughness={0.9} />
        </mesh>
        
        {/* Branch 2 */}
        <mesh position={[-0.15, 1.0, 0.1]} rotation={[0.2, 0, 0.5]}>
          <cylinderGeometry args={[0.02, 0.04, 0.4, 8]} />
          <meshStandardMaterial color="#5D4A3A" roughness={0.9} />
        </mesh>

        {/* Main foliage cloud 1 - center */}
        <mesh position={[0, 1.8, 0]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <MeshDistortMaterial 
            color="#3D8B7A"
            emissive="#1A4A40"
            emissiveIntensity={0.2}
            roughness={0.8}
            distort={0.15}
            speed={1.5}
          />
        </mesh>

        {/* Foliage cloud 2 - right */}
        <mesh position={[0.5, 1.5, 0.1]}>
          <sphereGeometry args={[0.45, 32, 32]} />
          <MeshDistortMaterial 
            color="#4A9D8A"
            emissive="#2D6A5D"
            emissiveIntensity={0.15}
            roughness={0.8}
            distort={0.12}
            speed={1.2}
          />
        </mesh>

        {/* Foliage cloud 3 - left */}
        <mesh position={[-0.4, 1.6, -0.1]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <MeshDistortMaterial 
            color="#52A892"
            emissive="#2D6A5D"
            emissiveIntensity={0.18}
            roughness={0.8}
            distort={0.1}
            speed={1.8}
          />
        </mesh>

        {/* Foliage cloud 4 - top */}
        <mesh position={[0.1, 2.3, 0]}>
          <sphereGeometry args={[0.35, 32, 32]} />
          <MeshDistortMaterial 
            color="#5CB8A0"
            emissive="#3D8B7A"
            emissiveIntensity={0.2}
            roughness={0.8}
            distort={0.08}
            speed={2}
          />
        </mesh>
      </group>
    </Float>
  );
};

// Floating flower petals
const FloatingPetals = () => {
  const petalsRef = useRef<THREE.Group>(null);
  
  const petals = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 0.5,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      rotation: Math.random() * Math.PI * 2,
      scale: 0.03 + Math.random() * 0.02,
      speed: 0.5 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (petalsRef.current) {
      petalsRef.current.children.forEach((petal, i) => {
        const data = petals[i];
        petal.position.y = data.position[1] + Math.sin(state.clock.elapsedTime * data.speed + data.offset) * 0.3;
        petal.rotation.y = state.clock.elapsedTime * 0.2 + data.rotation;
        petal.rotation.x = Math.sin(state.clock.elapsedTime * 0.3 + data.offset) * 0.2;
      });
    }
  });

  return (
    <group ref={petalsRef}>
      {petals.map((petal, i) => (
        <mesh key={i} position={petal.position} scale={petal.scale}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#F8C8DC" : "#E8B4C8"} 
            emissive={i % 2 === 0 ? "#F8C8DC" : "#E8B4C8"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  );
};

// Zen garden ground with ripples
const ZenGround = () => {
  return (
    <group>
      {/* Main ground */}
      <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[4, 64]} />
        <meshStandardMaterial 
          color="#1A2F2A"
          roughness={0.95}
        />
      </mesh>
      
      {/* Stone base for tree */}
      <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.8, 32]} />
        <meshStandardMaterial 
          color="#2A3D38"
          roughness={0.9}
        />
      </mesh>

      {/* Decorative stones */}
      {[
        [1.5, -0.7, 0.8],
        [-1.2, -0.7, 1.2],
        [0.8, -0.7, -1.5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.12 + i * 0.03, 12, 12]} />
          <meshStandardMaterial color="#3A4A45" roughness={0.85} />
        </mesh>
      ))}
    </group>
  );
};

// Ambient particles
const AmbientGlow = () => {
  return (
    <>
      {/* Main sparkles around tree */}
      <Sparkles 
        count={50}
        scale={[4, 4, 4]}
        size={2}
        speed={0.2}
        opacity={0.5}
        color="#7DD8C8"
      />
      
      {/* Golden light particles */}
      <Sparkles 
        count={20}
        scale={[3, 2, 3]}
        position={[0, 1.5, 0]}
        size={1.5}
        speed={0.1}
        opacity={0.4}
        color="#FFD89E"
      />
    </>
  );
};

// 3D Scene
const GardenScene = () => {
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#B8E0D8" />
      
      {/* Main key light - warm sunlight */}
      <directionalLight 
        position={[5, 8, 3]} 
        intensity={0.4} 
        color="#FFF5E6"
        castShadow
      />
      
      {/* Rim light - cool accent */}
      <directionalLight 
        position={[-3, 4, -2]} 
        intensity={0.2} 
        color="#A8D8EA"
      />
      
      {/* Tree glow light */}
      <pointLight 
        position={[0, 2, 0]} 
        intensity={0.6} 
        color="#5CB8A0" 
        distance={5}
        decay={2}
      />

      {/* Ground ambient */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={0.2} 
        color="#3D8B7A" 
        distance={4}
      />

      <fog attach="fog" args={['#0D1A16', 5, 15]} />

      <AmbientGlow />
      <FloatingPetals />
      <HealingTree />
      <ZenGround />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.12}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3.5}
        maxAzimuthAngle={Math.PI / 4}
        minAzimuthAngle={-Math.PI / 4}
      />
    </>
  );
};

// Loading state
const LoadingFallback = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
  </div>
);

export const GardenScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative h-full flex items-center justify-center rounded-3xl overflow-hidden"
    >
      {/* Deep calming gradient background */}
      <div 
        className="absolute inset-0"
        style={{ 
          background: `
            radial-gradient(ellipse at center bottom, hsl(170 35% 10%) 0%, hsl(220 30% 6%) 70%),
            radial-gradient(ellipse at top right, hsl(175 40% 15% / 0.3) 0%, transparent 50%)
          `
        }}
      />

      {/* Subtle vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(220 30% 4% / 0.6) 100%)'
        }}
      />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas 
          camera={{ position: [0, 1.8, 5.5], fov: 38 }}
          shadows
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <GardenScene />
          </Suspense>
        </Canvas>
      </div>

      {/* Minimal HUD overlay */}
      <div className="absolute inset-0 pointer-events-none p-8 flex flex-col justify-between">
        {/* Top - Gentle title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="glass-card-subtle px-8 py-4 text-center pointer-events-auto backdrop-blur-xl">
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <SparklesIcon className="w-4 h-4 text-primary opacity-70" />
              <h1 className="text-xl font-medium text-foreground tracking-wide">Your Healing Garden</h1>
              <SparklesIcon className="w-4 h-4 text-primary opacity-70" />
            </div>
            <p className="text-sm text-muted-foreground">A sanctuary for peace and growth</p>
          </div>
        </motion.div>

        {/* Bottom - Stats panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="glass-card-subtle px-10 py-7 pointer-events-auto max-w-xl w-full backdrop-blur-xl">
            <div className="flex items-center justify-around">
              {/* Streak */}
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/10">
                  <Sun className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-semibold text-foreground">7</p>
                <p className="text-xs text-muted-foreground mt-1">Day Streak</p>
              </motion.div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-border/50 to-transparent" />

              {/* Growth */}
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/10">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-semibold text-foreground">Thriving</p>
                <p className="text-xs text-muted-foreground mt-1">Your garden</p>
              </motion.div>

              <div className="w-px h-16 bg-gradient-to-b from-transparent via-border/50 to-transparent" />

              {/* Mindful */}
              <motion.div 
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/25 to-accent/10 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-accent/10">
                  <Wind className="w-6 h-6 text-accent" />
                </div>
                <p className="text-3xl font-semibold text-foreground">12</p>
                <p className="text-xs text-muted-foreground mt-1">Mindful minutes</p>
              </motion.div>
            </div>

            {/* Quote */}
            <div className="mt-7 pt-6 border-t border-border/30 text-center">
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "Like a garden, the mind flourishes with patience and gentle care."
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ambient floating indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-2 text-xs text-muted-foreground/50"
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Drag to explore</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
