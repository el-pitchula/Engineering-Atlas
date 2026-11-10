
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BrakeSystemModelProps {
  onSelect: (id: string) => void
  selectedComponent: string
  exploded: boolean
}

export default function BrakeSystemModel({
  onSelect,
  selectedComponent,
  exploded,
}: BrakeSystemModelProps) {
  const discRef = useRef<THREE.Group>(null)
  const caliperRef = useRef<THREE.Group>(null)
  const padsRef = useRef<THREE.Group>(null)
  const hubRef = useRef<THREE.Group>(null)
  const wheelRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    const movements = [
      {
        ref: wheelRef,
        integrated: -0.65,
        separated: -2.5,
      },
      {
        ref: hubRef,
        integrated: -0.15,
        separated: -1.25,
      },
      {
        ref: discRef,
        integrated: 0,
        separated: 0,
      },
      {
        ref: padsRef,
        integrated: 0,
        separated: 0.95,
      },
      {
        ref: caliperRef,
        integrated: 0.35,
        separated: 2.0,
      },
    ]

    movements.forEach(({ ref, integrated, separated }) => {
      if (!ref.current) return

      const target = exploded ? separated : integrated

      ref.current.position.x = THREE.MathUtils.damp(
        ref.current.position.x,
        target,
        5,
        delta
      )
    })
  })

  const activeMaterial = (id: string, color: string) => (
    <meshStandardMaterial
      color={color}
      metalness={0.75}
      roughness={0.3}
      emissive={selectedComponent === id ? color : '#000000'}
      emissiveIntensity={selectedComponent === id ? 0.22 : 0}
    />
  )

  return (
    <group rotation={[0.12, -0.25, 0]}>
      {/* DISCO DE FREIO */}
      <group
        ref={discRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('disc')
        }}
      >
        {/* Corpo do disco */}
        <mesh
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[1.13, 1.13, 0.16, 64]} />
          {activeMaterial('disc', '#aeb4bd')}
        </mesh>

        {/* Superfície central */}
        <mesh
          position={[-0.09, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.43, 0.43, 0.035, 48]} />
          {activeMaterial('disc', '#858d98')}
        </mesh>

        {/* Perfurações de ventilação ilustrativas */}
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2
          const y = Math.cos(angle) * 0.88
          const z = Math.sin(angle) * 0.88

          return (
            <mesh
              key={index}
              position={[-0.09, y, z]}
            >
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#454a51" />
            </mesh>
          )
        })}

        {/* Anel de acabamento */}
        <mesh
          rotation={[0, 0, Math.PI / 2]}
        >
          <torusGeometry args={[1.08, 0.035, 10, 64]} />
          <meshStandardMaterial
            color="#d0d4da"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>
      </group>

      {/* PINÇA DE FREIO */}
      <group
        ref={caliperRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('caliper')
        }}
      >
        {/* Corpo principal */}
        <mesh
          position={[0, 0.85, 0]}
          castShadow
        >
          <boxGeometry args={[0.43, 0.62, 0.9]} />
          {activeMaterial('caliper', '#c93636')}
        </mesh>

        {/* Parte superior */}
        <mesh
          position={[0, 1.2, 0]}
          castShadow
        >
          <boxGeometry args={[0.5, 0.17, 0.98]} />
          {activeMaterial('caliper', '#e04444')}
        </mesh>

        {/* Extremidade inferior */}
        <mesh
          position={[0, 0.53, 0]}
          castShadow
        >
          <boxGeometry args={[0.46, 0.18, 0.95]} />
          {activeMaterial('caliper', '#a92c2c')}
        </mesh>

        {/* Detalhe lateral */}
        <mesh
          position={[0.23, 0.87, 0]}
        >
          <boxGeometry args={[0.035, 0.35, 0.48]} />
          <meshStandardMaterial
            color="#6e2020"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* PASTILHAS DE FREIO */}
      <group
        ref={padsRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('pads')
        }}
      >
        {[-1, 1].map((side) => (
          <group
            key={side}
            position={[side * 0.17, 0, 0]}
          >
            {/* Base metálica */}
            <mesh castShadow>
              <boxGeometry args={[0.11, 0.72, 0.48]} />
              <meshStandardMaterial
                color="#777d85"
                metalness={0.7}
                roughness={0.4}
                emissive={selectedComponent === 'pads' ? '#c68b58' : '#000000'}
                emissiveIntensity={selectedComponent === 'pads' ? 0.15 : 0}
              />
            </mesh>

            {/* Material de atrito */}
            <mesh
              position={[side * 0.065, 0, 0]}
            >
              <boxGeometry args={[0.055, 0.66, 0.42]} />
              {activeMaterial('pads', '#c68b58')}
            </mesh>
          </group>
        ))}
      </group>

      {/* CUBO DE RODA */}
      <group
        ref={hubRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('hub')
        }}
      >
        {/* Corpo central */}
        <mesh
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.42, 0.42, 0.48, 48]} />
          {activeMaterial('hub', '#929aa5')}
        </mesh>

        {/* Flange de fixação */}
        <mesh
          position={[0.22, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.52, 0.52, 0.1, 48]} />
          {activeMaterial('hub', '#abb2bc')}
        </mesh>

        {/* Parafusos */}
        {Array.from({ length: 5 }).map((_, index) => {
          const angle = (index / 5) * Math.PI * 2
          const y = Math.cos(angle) * 0.34
          const z = Math.sin(angle) * 0.34

          return (
            <mesh
              key={index}
              position={[0.29, y, z]}
              rotation={[0, 0, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.055, 0.055, 0.08, 12]} />
              <meshStandardMaterial
                color="#d4d7dc"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          )
        })}
      </group>

      {/* RODA */}
      <group
        ref={wheelRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('wheel')
        }}
      >
        {/* Aro externo */}
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[1.52, 0.12, 20, 64]} />
          {activeMaterial('wheel', '#555b64')}
        </mesh>

        {/* Aro interno */}
        <mesh
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[1.25, 0.075, 16, 64]} />
          {activeMaterial('wheel', '#777e88')}
        </mesh>

        {/* Raios da roda */}
        {Array.from({ length: 10 }).map((_, index) => {
          const angle = (index / 10) * Math.PI * 2

          const y = Math.cos(angle) * 0.77
          const z = Math.sin(angle) * 0.77

          return (
            <mesh
              key={index}
              position={[-0.02, y, z]}
              rotation={[angle, 0, 0]}
              castShadow
            >
              <boxGeometry args={[0.09, 0.95, 0.1]} />
              {activeMaterial('wheel', '#858c96')}
            </mesh>
          )
        })}

        {/* Região central da roda */}
        <mesh
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.48, 0.48, 0.12, 48]} />
          {activeMaterial('wheel', '#626a74')}
        </mesh>
      </group>
    </group>
  )
}
