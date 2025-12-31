import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';

import p1 from '../../../shared/assets/images/death-note.jpg';
import p2 from '../../../shared/assets/images/demon-slayer.jpg';
import p3 from '../../../shared/assets/images/dorohedoro.webp';
import p4 from '../../../shared/assets/images/howls-moving-castle.jpg';
import p5 from '../../../shared/assets/images/jujutsu-kaisen.jpg';
import p6 from '../../../shared/assets/images/naruto.jpg';
import p7 from '../../../shared/assets/images/solo-leveling.jpg';
import p8 from '../../../shared/assets/images/spirited-away.jpeg';

/**
 * Individual Flying Poster Component.
 */
const FlyingPoster = ({
  texture,
  position,
  rotation,
}: {
  texture: THREE.Texture;
  position: THREE.Vector3;
  rotation: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [targetY] = useState(position.y + 3 + Math.random() * 2);
  const [speed] = useState(0.04 + Math.random() * 0.04);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (meshRef.current.position.y < targetY) {
      meshRef.current.position.y += speed;
      meshRef.current.scale.x = THREE.MathUtils.lerp(
        meshRef.current.scale.x,
        1.6,
        0.05
      );
      meshRef.current.scale.y = THREE.MathUtils.lerp(
        meshRef.current.scale.y,
        2.2,
        0.05
      );
    }

    meshRef.current.rotation.set(
      state.camera.rotation.x,
      state.camera.rotation.y,
      state.camera.rotation.z
    );
    meshRef.current.rotateZ(rotation);

    const material = meshRef.current.material as THREE.MeshBasicMaterial;
    if (material.opacity > 0) {
      const fadeFactor = meshRef.current.position.y >= targetY ? 0.35 : 0.08;
      material.opacity -= delta * fadeFactor;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={[0.1, 0.1, 0.1]}>
      <planeGeometry args={[1, 1.4]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.9}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
};

/**
 * Emitter logic with strict "One active poster per cube" constraint.
 */
const PosterEmitter = () => {
  const textures = useLoader(THREE.TextureLoader, [
    p1,
    p2,
    p3,
    p4,
    p5,
    p6,
    p7,
    p8,
  ]);
  const [posters, setPosters] = useState<
    {
      id: string;
      pos: THREE.Vector3;
      texture: THREE.Texture;
      rotation: number;
    }[]
  >([]);

  // Track active spawn points to prevent overlapping
  const spawnedCubes = useRef<Set<string>>(new Set());

  const handlePointerMove = (e: any) => {
    e.stopPropagation();

    // Create a strict grid key based on voxel coordinates
    const gridX = Math.round(e.point.x);
    const gridZ = Math.round(e.point.z);
    const cubeKey = `${gridX}-${gridZ}`;

    // Block spawn if this cube is already "occupied" by an active poster
    if (!spawnedCubes.current.has(cubeKey)) {
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      const newPoster = {
        id: uniqueId,
        pos: e.point.clone().add(new THREE.Vector3(0, 0.5, 0)),
        texture: textures[Math.floor(Math.random() * textures.length)],
        rotation: (Math.random() - 0.5) * 0.2,
      };

      // Update state and lock the cube
      setPosters((prev) => [...prev.slice(-15), newPoster]);
      spawnedCubes.current.add(cubeKey);

      // Lock duration increased to match the full animation cycle (~4-5 seconds)
      // This ensures only one poster is visible per cube at a time
      setTimeout(() => {
        spawnedCubes.current.delete(cubeKey);
      }, 5000);
    }
  };

  return (
    <group>
      <mesh
        onPointerMove={handlePointerMove}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {posters.map((p) => (
        <FlyingPoster
          key={p.id}
          texture={p.texture}
          position={p.pos}
          rotation={p.rotation}
        />
      ))}
    </group>
  );
};

const VoxelField = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const rows = 25;
  const cols = 25;
  const count = rows * cols;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    let i = 0;
    for (let x = 0; x < rows; x++) {
      for (let z = 0; z < cols; z++) {
        const wave = Math.sin(x * 0.3 + time) + Math.cos(z * 0.3 + time);
        dummy.position.set(x - rows / 2, wave * 0.5, z - cols / 2);
        dummy.rotation.y = time * 0.5 + (x + z) * 0.1;
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i++, dummy.matrix);
      }
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null as any, null as any, count]}
      castShadow
    >
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
    <div className="fixed inset-0 -z-10 bg-[#020617] overflow-hidden pointer-events-auto">
      <Canvas
        shadows
        camera={{ position: [15, 10, 15], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#020617']} />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
        <spotLight
          position={[-10, 20, 10]}
          angle={0.15}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <fog attach="fog" args={['#020617', 15, 45]} />
        <Suspense fallback={null}>
          <VoxelField />
          <PosterEmitter />
        </Suspense>
      </Canvas>
    </div>
  );
};
