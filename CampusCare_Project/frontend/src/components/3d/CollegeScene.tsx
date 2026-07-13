import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float, PresentationControls, ContactShadows } from '@react-three/drei';

const Book = ({ position, rotation, color = "#2B4C7E" }: any) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Cover */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.3, 2.8]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      {/* Pages */}
      <mesh position={[0.05, 0, 0]}>
        <boxGeometry args={[1.9, 0.2, 2.7]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
    </group>
  );
};

const GraduationCap = ({ position, rotation }: any) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Base */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Top board */}
      <mesh position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[1.5, 0.05, 1.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.7} />
      </mesh>
      {/* Tassel */}
      <mesh position={[0.6, -0.2, 0.6]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.6]} />
        <meshStandardMaterial color="#d4af37" />
      </mesh>
    </group>
  );
};

const Pencil = ({ position, rotation }: any) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1.5, 6]} />
        <meshStandardMaterial color="#facc15" roughness={0.3} />
      </mesh>
      {/* Metal band */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.2, 16]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Eraser */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial color="#f472b6" roughness={0.6} />
      </mesh>
      {/* Wood cone */}
      <mesh position={[0, -0.9, 0]}>
        <coneGeometry args={[0.1, 0.3, 16]} />
        <meshStandardMaterial color="#e7c697" />
      </mesh>
      {/* Lead tip */}
      <mesh position={[0, -1.1, 0]}>
        <coneGeometry args={[0.03, 0.1, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </group>
  );
};

export const CollegeScene = () => {
  return (
    <div className="w-full h-[500px] md:h-[600px] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <PresentationControls 
          global 
          config={{ mass: 2, tension: 500 }} 
          snap={{ mass: 4, tension: 1500 }} 
          rotation={[0, -0.3, 0]} 
          polar={[-Math.PI / 3, Math.PI / 3]} 
          azimuth={[-Math.PI / 1.4, Math.PI / 2]}
        >
          <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
            {/* Center piece - Graduation Cap */}
            <GraduationCap position={[0, 1, 0]} rotation={[0.2, -0.2, 0]} />
          </Float>
          
          <Float speed={1.5} rotationIntensity={1.5} floatIntensity={1}>
            {/* Book stack */}
            <Book position={[-1.5, -0.5, 1]} rotation={[-0.1, 0.3, 0]} color="#4f46e5" />
            <Book position={[-1.6, 0, 0.8]} rotation={[-0.05, 0.1, 0]} color="#0ea5e9" />
          </Float>

          <Float speed={2.5} rotationIntensity={2} floatIntensity={2}>
            {/* Pencil floating */}
            <Pencil position={[1.8, 0, 0]} rotation={[1, 0.5, 1]} />
          </Float>
          
          <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
             {/* Small floating particles/accents */}
             <mesh position={[2, 2, -1]}>
               <sphereGeometry args={[0.2]} />
               <meshStandardMaterial color="#facc15" emissive="#facc15" emissiveIntensity={0.5} />
             </mesh>
             <mesh position={[-2, 1.5, -2]}>
               <sphereGeometry args={[0.3]} />
               <meshStandardMaterial color="#4f46e5" emissive="#4f46e5" emissiveIntensity={0.5} />
             </mesh>
          </Float>

        </PresentationControls>

        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default CollegeScene;
