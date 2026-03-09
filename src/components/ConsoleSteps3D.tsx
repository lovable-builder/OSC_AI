import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import React, { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ConsoleStep = {
  button: string;
  zone: string;
  color: string; // hex string from backend (e.g. "#FF6B2B")
  desc: string;
};

interface ConsoleSteps3DProps {
  steps: ConsoleStep[];
  activeIndex: number;
  onActiveIndexChange?: (index: number) => void;
  className?: string;
  height?: number;
}

type ButtonProps = {
  step: ConsoleStep;
  index: number;
  position: [number, number, number];
  activeIndex: number;
  onSelect?: (index: number) => void;
};

function ConsoleButtonMesh({ step, index, position, activeIndex, onSelect }: ButtonProps) {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const isActive = index === activeIndex;
  const baseColor = useMemo(() => new THREE.Color(step.color), [step.color]);

  useFrame((state) => {
    const g = ref.current;
    if (!g) return;

    // A subtle "alive" motion + active lift
    const t = state.clock.elapsedTime;
    const targetY = (isActive ? 0.12 : 0) + (hovered ? 0.06 : 0) + Math.sin(t * 2 + index) * 0.01;
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY, 0.12);

    const targetRotX = hovered ? -0.12 : -0.18;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, targetRotX, 0.08);

    const targetScale = hovered ? 1.06 : 1;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 0.1));
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={[-0.18, 0, 0]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect?.(index)}
    >
      {/* button body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.28, 0.5]} />
        <meshPhysicalMaterial
          color={new THREE.Color("#111111")}
          metalness={0.45}
          roughness={0.25}
          clearcoat={0.9}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* inset face */}
      <mesh position={[0, 0.06, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 0.14, 0.4]} />
        <meshStandardMaterial
          color={new THREE.Color("#0b0b0b")}
          emissive={baseColor}
          emissiveIntensity={isActive ? 0.7 : hovered ? 0.25 : 0.08}
          roughness={0.4}
          metalness={0.25}
        />
      </mesh>

      {/* glow sheet */}
      <mesh position={[0, 0.06, 0.18]}>
        <planeGeometry args={[1.25, 0.55]} />
        <meshBasicMaterial
          transparent
          opacity={isActive ? 0.25 : hovered ? 0.14 : 0.08}
          color={baseColor}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* label */}
      <Text
        position={[0, 0.14, 0.28]}
        fontSize={0.12}
        color={isActive ? "#ffffff" : "#cfcfcf"}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.9}
      >
        {step.button.toUpperCase()}
      </Text>
    </group>
  );
}

function Scene({ steps, activeIndex, onActiveIndexChange }: Pick<ConsoleSteps3DProps, "steps" | "activeIndex" | "onActiveIndexChange">) {
  const layout = useMemo(() => {
    const n = steps.length;
    const cols = Math.min(5, Math.max(3, Math.ceil(Math.sqrt(n))));
    const rows = Math.ceil(n / cols);

    const spacingX = 1.12;
    const spacingZ = 0.82;

    const startX = -((cols - 1) * spacingX) / 2;
    const startZ = -((rows - 1) * spacingZ) / 2;

    const positions: Array<[number, number, number]> = [];
    for (let i = 0; i < n; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      positions.push([startX + c * spacingX, 0, startZ + r * spacingZ]);
    }

    const panelW = cols * spacingX + 1.1;
    const panelD = rows * spacingZ + 1.0;

    return { positions, panelW, panelD };
  }, [steps]);

  return (
    <>
      <color attach="background" args={["transparent"]} />

      {/* Lighting */}
      <ambientLight intensity={0.35} />
      <spotLight
        position={[4, 6, 2]}
        intensity={1.2}
        angle={0.35}
        penumbra={0.7}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, 3]} intensity={0.6} />

      {/* Console panel */}
      <group position={[0, -0.18, 0]}>
        <mesh receiveShadow>
          <boxGeometry args={[layout.panelW, 0.35, layout.panelD]} />
          <meshStandardMaterial color={new THREE.Color("#050505")} roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.18, 0]} receiveShadow>
          <boxGeometry args={[layout.panelW * 0.98, 0.02, layout.panelD * 0.98]} />
          <meshStandardMaterial color={new THREE.Color("#0a0a0a")} roughness={0.8} metalness={0.1} />
        </mesh>
      </group>

      {/* Buttons */}
      {steps.map((step, i) => (
        <ConsoleButtonMesh
          key={`${step.button}-${i}`}
          step={step}
          index={i}
          activeIndex={activeIndex}
          position={layout.positions[i]}
          onSelect={onActiveIndexChange}
        />
      ))}

      <ContactShadows opacity={0.55} scale={12} blur={2.4} far={8} resolution={512} position={[0, -0.35, 0]} />
      <Environment preset="warehouse" />
    </>
  );
}

export default function ConsoleSteps3D({ steps, activeIndex, onActiveIndexChange, className, height = 260 }: ConsoleSteps3DProps) {
  return (
    <div className={cn("w-full rounded-xl overflow-hidden", className)} style={{ height }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 3.2, 4.4], fov: 40, near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <group rotation={[0, Math.PI * 0.03, 0]}>
          <Scene steps={steps} activeIndex={activeIndex} onActiveIndexChange={onActiveIndexChange} />
        </group>
      </Canvas>
    </div>
  );
}
