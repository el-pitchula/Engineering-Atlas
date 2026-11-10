
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface BrakeSystemModelProps {
  onSelect: (id: string) => void
  selectedComponent: string
  exploded: boolean
}

interface CalloutProps {
  position: [number, number, number]
  number: string
  label: string
  active: boolean
  onSelect: () => void
}

function Callout({
  position,
  number,
  label,
  active,
  onSelect,
}: CalloutProps) {
  return (
    <group position={position}>
      <Line
        points={[[0, 0, 0], [0, 0.3, 0]]}
        color={active ? '#ef5555' : '#858b94'}
        lineWidth={1}
      />

      <Html
        position={[0, 0.34, 0]}
        center
        distanceFactor={8}
        zIndexRange={[20, 0]}
      >
        <div
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: active ? '7px 11px' : '6px 8px',
            background: active
              ? 'rgba(239, 85, 85, 0.95)'
              : 'rgba(22, 24, 28, 0.88)',
            border: `1px solid ${active ? '#ff8585' : '#626871'}`,
            borderRadius: '4px',
            color: active ? '#ffffff' : '#c4c9d0',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: active
              ? '0 0 16px rgba(239, 85, 85, 0.35)'
              : '0 3px 12px rgba(0,0,0,0.3)',
            transition: 'all 0.2s ease',
            userSelect: 'none',
          }}
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: '11px',
            }}
          >
            {number}
          </span>

          {active && (
            <span>{label}</span>
          )}
        </div>
      </Html>
    </group>
  )
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
        <mesh
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[1.13, 1.13, 0.16, 64]} />
          {activeMaterial('disc', '#aeb4bd')}
        </mesh>

        <mesh
          position={[-0.09, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.43, 0.43, 0.035, 48]} />
          {activeMaterial('disc', '#858d98')}
        </mesh>

        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2

          return (
            <mesh
              key={index}
              position={[
                -0.09,
                Math.cos(angle) * 0.88,
                Math.sin(angle) * 0.88,
              ]}
            >
              <sphereGeometry args={[0.035, 12, 12]} />
              <meshStandardMaterial color="#454a51" />
            </mesh>
          )
        })}

        <mesh rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[1.08, 0.035, 10, 64]} />
          <meshStandardMaterial
            color="#d0d4da"
            metalness={0.85}
            roughness={0.25}
          />
        </mesh>

        <Callout
          position={[0, 1.3, -0.1]}
          number="01"
          label="DISCO"
          active={selectedComponent === 'disc'}
          onSelect={() => onSelect('disc')}
        />
      </group>

      {/* PINÇA DE FREIO */}
      <group
        ref={caliperRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('caliper')
        }}
      >
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.43, 0.62, 0.9]} />
          {activeMaterial('caliper', '#c93636')}
        </mesh>

        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[0.5, 0.17, 0.98]} />
          {activeMaterial('caliper', '#e04444')}
        </mesh>

        <mesh position={[0, 0.53, 0]} castShadow>
          <boxGeometry args={[0.46, 0.18, 0.95]} />
          {activeMaterial('caliper', '#a92c2c')}
        </mesh>

        <mesh position={[0.23, 0.87, 0]}>
          <boxGeometry args={[0.035, 0.35, 0.48]} />
          <meshStandardMaterial
            color="#6e2020"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>

        <Callout
          position={[0, 1.5, 0.5]}
          number="02"
          label="PINÇA"
          active={selectedComponent === 'caliper'}
          onSelect={() => onSelect('caliper')}
        />
      </group>

      {/* PASTILHAS */}
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

            <mesh position={[side * 0.065, 0, 0]}>
              <boxGeometry args={[0.055, 0.66, 0.42]} />
              {activeMaterial('pads', '#c68b58')}
            </mesh>
          </group>
        ))}

        <Callout
          position={[0, 0.1, 0.7]}
          number="03"
          label="PASTILHAS"
          active={selectedComponent === 'pads'}
          onSelect={() => onSelect('pads')}
        />
      </group>

      {/* CUBO DE RODA */}
      <group
        ref={hubRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('hub')
        }}
      >
        <mesh
          rotation={[0, 0, Math.PI / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.42, 0.42, 0.48, 48]} />
          {activeMaterial('hub', '#929aa5')}
        </mesh>

        <mesh
          position={[0.22, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.52, 0.52, 0.1, 48]} />
          {activeMaterial('hub', '#abb2bc')}
        </mesh>

        {Array.from({ length: 5 }).map((_, index) => {
          const angle = (index / 5) * Math.PI * 2

          return (
            <mesh
              key={index}
              position={[
                0.29,
                Math.cos(angle) * 0.34,
                Math.sin(angle) * 0.34,
              ]}
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

        <Callout
          position={[0.35, -0.65, 0]}
          number="04"
          label="CUBO"
          active={selectedComponent === 'hub'}
          onSelect={() => onSelect('hub')}
        />
      </group>

      {/* RODA */}
      <group
        ref={wheelRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('wheel')
        }}
      >
        <mesh
          rotation={[0, Math.PI / 2, 0]}
          castShadow
          receiveShadow
        >
          <torusGeometry args={[1.52, 0.12, 20, 64]} />
          {activeMaterial('wheel', '#555b64')}
        </mesh>

        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1.25, 0.075, 16, 64]} />
          {activeMaterial('wheel', '#777e88')}
        </mesh>

        {Array.from({ length: 10 }).map((_, index) => {
          const angle = (index / 10) * Math.PI * 2

          return (
            <mesh
              key={index}
              position={[
                -0.02,
                Math.cos(angle) * 0.77,
                Math.sin(angle) * 0.77,
              ]}
              rotation={[angle, 0, 0]}
              castShadow
            >
              <boxGeometry args={[0.09, 0.95, 0.1]} />
              {activeMaterial('wheel', '#858c96')}
            </mesh>
          )
        })}

        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.48, 0.48, 0.12, 48]} />
          {activeMaterial('wheel', '#626a74')}
        </mesh>

        <Callout
          position={[0, 1.85, -0.4]}
          number="05"
          label="RODA"
          active={selectedComponent === 'wheel'}
          onSelect={() => onSelect('wheel')}
        />
      </group>
    </group>
  )
}
