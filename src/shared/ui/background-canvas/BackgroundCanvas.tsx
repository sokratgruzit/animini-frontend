import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Advanced Instanced Voxel Wave.
 * High performance, professional look, no missing params.
 */
const VoxelField = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const rows = 25;
  const cols = 25;
  const count = rows * cols;

  // Pre-allocate object for matrix calculations (memory optimization)
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    let i = 0;

    for (let x = 0; x < rows; x++) {
      for (let z = 0; z < cols; z++) {
        // Create organic wave movement
        const wave1 = Math.sin(x * 0.3 + time);
        const wave2 = Math.cos(z * 0.3 + time);
        const y = wave1 + wave2;

        // Position each voxel
        dummy.position.set(x - rows / 2, y * 0.5, z - cols / 2);
        
        // Dynamic rotation based on position and time
        dummy.rotation.y = time * 0.5 + (x + z) * 0.1;
        
        // Update matrix
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} castShadow>
      {/* Box geometry with small scale for high-tech look */}
      <boxGeometry args={[0.4, 0.4, 0.4]} />
      <meshStandardMaterial 
        color="#4f46e5" 
        metalness={0.8} 
        roughness={0.2} 
        emissive="#1e1b4b"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  );
};

export const BackgroundCanvas = () => {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden pointer-events-none">
      <Canvas 
        shadows 
        camera={{ position: [15, 10, 15], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#020617']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
        <spotLight 
          position={[-10, 20, 10]} 
          angle={0.2} 
          penumbra={1} 
          intensity={2} 
          castShadow 
        />
        
        {/* Fog adds distance depth */}
        <fog attach="fog" args={['#020617', 15, 35]} />

        <Suspense fallback={null}>
          <VoxelField />
        </Suspense>
      </Canvas>
    </div>
  );
};
