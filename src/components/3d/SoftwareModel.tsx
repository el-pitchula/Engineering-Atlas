
import type { ReactNode } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, Line, Edges } from '@react-three/drei'
import * as THREE from 'three'

interface SoftwareModelProps {
  onSelect: (id: string) => void
  selectedComponent: string
  exploded: boolean
}

interface SelectablePartProps {
  id: string
  number: string
  label: string
  position: [number, number, number]
  explodedOffset: [number, number, number]
  exploded: boolean
  onSelect: (id: string) => void
  calloutPosition: [number, number, number]
  lineStart: [number, number, number]
  children: ReactNode
}

function ComponentCallout({
  number,
  label,
  position,
  lineStart,
}: {
  number: string
  label: string
  position: [number, number, number]
  lineStart: [number, number, number]
}) {
  return (
    <group>
      <Line
        points={[lineStart, position]}
        color="#8ba9ed"
        lineWidth={1.2}
        transparent
        opacity={0.85}
      />

      <mesh position={lineStart}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#c4a5ef" />
      </mesh>

      <Html
        position={position}
        center
        distanceFactor={8}
        zIndexRange={[100, 0]}
        occlude={false}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '6px 11px 6px 6px',
            background: 'rgba(14, 20, 37, 0.97)',
            border: '1px solid rgba(139, 169, 237, 0.75)',
            borderRadius: '3px',
            color: '#eef0f8',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            userSelect: 'none',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
          }}
        >
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: '21px',
              height: '21px',
              background: '#8ba9ed',
              color: '#111624',
              fontWeight: 700,
              borderRadius: '2px',
              flexShrink: 0,
            }}
          >
            {number}
          </span>

          <span>{label}</span>
        </div>
      </Html>
    </group>
  )
}

function SelectablePart({
  id,
  number,
  label,
  position,
  explodedOffset,
  exploded,
  onSelect,
  calloutPosition,
  lineStart,
  children,
}: SelectablePartProps) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect(id)
  }

  return (
    <group
      position={[
        position[0] + (exploded ? explodedOffset[0] : 0),
        position[1] + (exploded ? explodedOffset[1] : 0),
        position[2] + (exploded ? explodedOffset[2] : 0),
      ]}
      onClick={handleClick}
    >
      {children}

      <ComponentCallout
        number={number}
        label={label}
        position={calloutPosition}
        lineStart={lineStart}
      />
    </group>
  )
}

function ComponentMaterial({
  color,
  selected,
  metalness = 0.3,
  roughness = 0.45,
}: {
  color: string
  selected: boolean
  metalness?: number
  roughness?: number
}) {
  return (
    <meshStandardMaterial
      color={selected ? '#c4d5ff' : color}
      metalness={metalness}
      roughness={roughness}
      emissive={selected ? '#526fb5' : '#000000'}
      emissiveIntensity={selected ? 0.35 : 0}
    />
  )
}

function Enclosure({
  selected,
}: {
  selected: boolean
}) {
  const corners = [
    [-1.75, -0.52, -1.15],
    [1.75, -0.52, -1.15],
    [-1.75, -0.52, 1.15],
    [1.75, -0.52, 1.15],
  ]

  return (
    <group>
      {/* Estrutura inferior */}

      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[3.9, 0.16, 2.8]} />
        <ComponentMaterial
          color="#343b49"
          selected={selected}
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {/* Laterais do gabinete */}

      <mesh position={[-1.9, 0, 0]}>
        <boxGeometry args={[0.12, 1.05, 2.8]} />
        <ComponentMaterial
          color="#515b6b"
          selected={selected}
          metalness={0.75}
        />
      </mesh>

      <mesh position={[1.9, 0, 0]}>
        <boxGeometry args={[0.12, 1.05, 2.8]} />
        <ComponentMaterial
          color="#515b6b"
          selected={selected}
          metalness={0.75}
        />
      </mesh>

      <mesh position={[0, 0, -1.34]}>
        <boxGeometry args={[3.9, 1.05, 0.12]} />
        <ComponentMaterial
          color="#454f60"
          selected={selected}
          metalness={0.75}
        />
      </mesh>

      {/* Pilares estruturais */}

      {corners.map((position, index) => (
        <mesh
          key={`corner-${index}`}
          position={position as [number, number, number]}
        >
          <boxGeometry args={[0.13, 1.0, 0.13]} />
          <ComponentMaterial
            color="#788398"
            selected={selected}
            metalness={0.8}
          />
        </mesh>
      ))}

      {/* Furos de ventilação */}

      {Array.from({ length: 7 }, (_, index) => (
        <mesh
          key={`vent-${index}`}
          position={[-1.972, -0.15 + index * 0.1, -0.85 + index * 0.22]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.035, 0.035, 0.025, 16]} />
          <meshStandardMaterial color="#171e2a" />
        </mesh>
      ))}

      {/* Bordas superiores */}

      <mesh position={[0, 0.52, 0]}>
        <boxGeometry args={[3.9, 0.08, 2.8]} />
        <meshStandardMaterial
          color="#667286"
          metalness={0.8}
          roughness={0.35}
          transparent
          opacity={0.4}
        />
        <Edges color="#9aafd9" />
      </mesh>

      {/* Detalhe frontal */}

      <mesh position={[0, -0.1, 1.405]}>
        <boxGeometry args={[0.85, 0.18, 0.025]} />
        <meshStandardMaterial color="#171d2a" />
      </mesh>

      <mesh position={[0.48, -0.1, 1.425]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color="#8ba9ed"
          emissive="#526fb5"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  )
}

function Mainboard({
  selected,
}: {
  selected: boolean
}) {
  const traces = [
    { position: [-1.0, 0.09, -0.35] as [number, number, number], size: [0.9, 0.018, 0.035] as [number, number, number] },
    { position: [-0.55, 0.09, -0.65] as [number, number, number], size: [0.035, 0.018, 0.55] as [number, number, number] },
    { position: [0.9, 0.09, -0.45] as [number, number, number], size: [0.85, 0.018, 0.035] as [number, number, number] },
    { position: [1.2, 0.09, 0.3] as [number, number, number], size: [0.035, 0.018, 0.65] as [number, number, number] },
    { position: [-0.95, 0.09, 0.65] as [number, number, number], size: [0.65, 0.018, 0.035] as [number, number, number] },
  ]

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.5, 0.13, 2.35]} />
        <ComponentMaterial
          color="#263b5e"
          selected={selected}
          metalness={0.3}
          roughness={0.65}
        />
      </mesh>

      {traces.map((trace, index) => (
        <mesh key={`trace-${index}`} position={trace.position}>
          <boxGeometry args={trace.size} />
          <meshStandardMaterial
            color="#b58b64"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Conectores de expansão */}

      {[-1.15, -0.85, 0.85, 1.15].map((x, index) => (
        <mesh
          key={`connector-${index}`}
          position={[x, 0.12, 0.92]}
        >
          <boxGeometry args={[0.18, 0.12, 0.38]} />
          <meshStandardMaterial
            color="#b7bdc9"
            metalness={0.75}
          />
        </mesh>
      ))}

      {/* Capacitores da placa */}

      {[-1.35, 1.35].map((x) => (
        <mesh key={x} position={[x, 0.2, -0.75]}>
          <cylinderGeometry args={[0.1, 0.1, 0.22, 20]} />
          <meshStandardMaterial
            color="#333d4b"
            metalness={0.5}
          />
        </mesh>
      ))}

      {/* Parafusos */}

      {[
        [-1.55, 0.1, -0.95],
        [1.55, 0.1, -0.95],
        [-1.55, 0.1, 0.95],
        [1.55, 0.1, 0.95],
      ].map((position, index) => (
        <mesh
          key={`screw-${index}`}
          position={position as [number, number, number]}
        >
          <cylinderGeometry args={[0.075, 0.075, 0.035, 16]} />
          <meshStandardMaterial
            color="#aab4c5"
            metalness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

function ProcessingModule({
  selected,
}: {
  selected: boolean
}) {
  return (
    <group>
      {/* Encapsulamento do processador */}

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.95, 0.25, 0.85]} />
        <ComponentMaterial
          color="#1c222d"
          selected={selected}
          metalness={0.45}
        />
      </mesh>

      {/* Tampa metálica */}

      <mesh position={[0, 0.34, 0]}>
        <boxGeometry args={[0.68, 0.045, 0.58]} />
        <meshStandardMaterial
          color="#aeb9ca"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      {/* Dissipador */}

      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.8, 0.18, 0.7]} />
        <ComponentMaterial
          color="#66758d"
          selected={selected}
          metalness={0.8}
        />
      </mesh>

      {Array.from({ length: 7 }, (_, index) => (
        <mesh
          key={`fin-${index}`}
          position={[-0.3 + index * 0.1, 0.62, 0]}
        >
          <boxGeometry args={[0.035, 0.12, 0.68]} />
          <meshStandardMaterial
            color="#aeb9ca"
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function MemoryStorage({
  selected,
}: {
  selected: boolean
}) {
  return (
    <group>
      {/* Módulo de memória */}

      <group position={[-0.48, 0.17, 0]}>
        <mesh>
          <boxGeometry args={[0.28, 0.15, 1.05]} />
          <ComponentMaterial
            color="#202c42"
            selected={selected}
          />
        </mesh>

        {Array.from({ length: 5 }, (_, index) => (
          <mesh
            key={`ram-chip-${index}`}
            position={[0, 0.09, -0.4 + index * 0.2]}
          >
            <boxGeometry args={[0.2, 0.06, 0.13]} />
            <meshStandardMaterial
              color="#aab5c6"
              metalness={0.65}
            />
          </mesh>
        ))}

        <mesh position={[0, -0.085, 0]}>
          <boxGeometry args={[0.28, 0.025, 0.95]} />
          <meshStandardMaterial
            color="#c49a5a"
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* Armazenamento SSD */}

      <group position={[0.55, 0.18, 0]}>
        <mesh>
          <boxGeometry args={[0.95, 0.18, 0.55]} />
          <ComponentMaterial
            color="#252d3a"
            selected={selected}
            metalness={0.5}
          />
        </mesh>

        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.65, 0.035, 0.35]} />
          <meshStandardMaterial
            color="#66758d"
            metalness={0.7}
          />
        </mesh>

        <mesh position={[0.4, 0, 0]}>
          <boxGeometry args={[0.12, 0.12, 0.32]} />
          <meshStandardMaterial
            color="#c49a5a"
            metalness={0.85}
          />
        </mesh>
      </group>
    </group>
  )
}

export default function SoftwareModel({
  onSelect,
  selectedComponent,
  exploded,
}: SoftwareModelProps) {
  return (
    <group rotation={[0.08, -0.28, 0]}>
      {/* 01 — GABINETE */}

      <SelectablePart
        id="enclosure"
        number="01"
        label="GABINETE ESTRUTURAL"
        position={[0, 0, 0]}
        explodedOffset={[0, 0, 0]}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[-2.8, 1.2, 1.8]}
        lineStart={[-1.8, 0.2, 1.1]}
      >
        <Enclosure selected={selectedComponent === 'enclosure'} />
      </SelectablePart>

      {/* 02 — PLACA PRINCIPAL */}

      <SelectablePart
        id="mainboard"
        number="02"
        label="PLACA PRINCIPAL"
        position={[0, 0, 0]}
        explodedOffset={[0, 0.9, 0]}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[0, 2.3, -1.4]}
        lineStart={[0, 0.1, -0.8]}
      >
        <Mainboard selected={selectedComponent === 'mainboard'} />
      </SelectablePart>

      {/* 03 — PROCESSAMENTO */}

      <SelectablePart
        id="processor"
        number="03"
        label="MÓDULO DE PROCESSAMENTO"
        position={[0, 0.12, -0.25]}
        explodedOffset={[0, 1.65, 0]}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[2.9, 1.5, -0.5]}
        lineStart={[0, 0.65, 0]}
      >
        <ProcessingModule
          selected={selectedComponent === 'processor'}
        />
      </SelectablePart>

      {/* 04 — MEMÓRIA E ARMAZENAMENTO */}

      <SelectablePart
        id="memory"
        number="04"
        label="MEMÓRIA E ARMAZENAMENTO"
        position={[0, 0.12, 0.35]}
        explodedOffset={[0, 1.2, 0.9]}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[2.8, 1.25, 1.8]}
        lineStart={[0.3, 0.25, 0.2]}
      >
        <MemoryStorage
          selected={selectedComponent === 'memory'}
        />
      </SelectablePart>
    </group>
  )
}
