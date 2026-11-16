
import type { ReactNode } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface ElectronicsModelProps {
  onSelect: (id: string) => void
  selectedComponent: string
  exploded: boolean
}

interface SelectablePartProps {
  id: string
  number: string
  label: string
  position: [number, number, number]
  explodedOffset: number
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
        color="#75c69a"
        lineWidth={1.2}
        transparent
        opacity={0.85}
      />

      <mesh position={lineStart}>
        <sphereGeometry args={[0.035, 10, 10]} />
        <meshBasicMaterial color="#b4d98b" />
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
            background: 'rgba(12, 25, 21, 0.97)',
            border: '1px solid rgba(117, 198, 154, 0.75)',
            borderRadius: '3px',
            color: '#edf3ee',
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
              background: '#75c69a',
              color: '#101b19',
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
        position[0],
        position[1] + (exploded ? explodedOffset : 0),
        position[2],
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

interface ComponentMaterialProps {
  color: string
  selected: boolean
  metalness?: number
  roughness?: number
}

function ComponentMaterial({
  color,
  selected,
  metalness = 0.25,
  roughness = 0.45,
}: ComponentMaterialProps) {
  return (
    <meshStandardMaterial
      color={selected ? '#b9e8a5' : color}
      metalness={metalness}
      roughness={roughness}
      emissive={selected ? '#5b9b58' : '#000000'}
      emissiveIntensity={selected ? 0.35 : 0}
    />
  )
}

function CircuitBoard({
  selected,
}: {
  selected: boolean
}) {
  const traces = [
    { position: [-0.95, 0.076, -0.35] as [number, number, number], size: [0.75, 0.012, 0.035] as [number, number, number] },
    { position: [-0.55, 0.076, -0.55] as [number, number, number], size: [0.035, 0.012, 0.4] as [number, number, number] },
    { position: [0.85, 0.076, -0.45] as [number, number, number], size: [0.65, 0.012, 0.035] as [number, number, number] },
    { position: [1.05, 0.076, 0.15] as [number, number, number], size: [0.035, 0.012, 0.55] as [number, number, number] },
    { position: [-0.95, 0.076, 0.55] as [number, number, number], size: [0.55, 0.012, 0.035] as [number, number, number] },
    { position: [0.65, 0.076, 0.65] as [number, number, number], size: [0.5, 0.012, 0.035] as [number, number, number] },
  ]

  const holes = [
    [-1.65, 0.09, -1.0],
    [1.65, 0.09, -1.0],
    [-1.65, 0.09, 1.0],
    [1.65, 0.09, 1.0],
  ]

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 0.14, 2.5]} />
        <ComponentMaterial
          color="#176347"
          selected={selected}
          roughness={0.7}
        />
      </mesh>

      {traces.map((trace, index) => (
        <mesh key={`trace-${index}`} position={trace.position}>
          <boxGeometry args={trace.size} />
          <meshStandardMaterial
            color="#c58c4a"
            metalness={0.75}
            roughness={0.3}
          />
        </mesh>
      ))}

      {holes.map((position, index) => (
        <mesh
          key={`hole-${index}`}
          position={position as [number, number, number]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.085, 0.085, 0.018, 24]} />
          <meshStandardMaterial
            color="#b78a50"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}

      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[3.65, 0.012, 2.35]} />
        <meshBasicMaterial
          color="#8bc49b"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  )
}

function Microcontroller({
  selected,
}: {
  selected: boolean
}) {
  const pins = Array.from({ length: 10 }, (_, index) => index)

  return (
    <group>
      <mesh position={[0, 0.16, 0]}>
        <boxGeometry args={[0.9, 0.2, 0.75]} />
        <ComponentMaterial
          color="#171a1c"
          selected={selected}
          metalness={0.35}
        />
      </mesh>

      <mesh position={[0, 0.268, 0]}>
        <boxGeometry args={[0.48, 0.018, 0.38]} />
        <meshStandardMaterial
          color="#292e30"
          metalness={0.5}
          roughness={0.35}
        />
      </mesh>

      {pins.map((index) => {
        const offset = (index - 4.5) * 0.075

        return (
          <group key={index}>
            <mesh position={[offset, 0.12, -0.4]}>
              <boxGeometry args={[0.035, 0.055, 0.12]} />
              <meshStandardMaterial
                color="#c5a66d"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>

            <mesh position={[offset, 0.12, 0.4]}>
              <boxGeometry args={[0.035, 0.055, 0.12]} />
              <meshStandardMaterial
                color="#c5a66d"
                metalness={0.85}
                roughness={0.25}
              />
            </mesh>
          </group>
        )
      })}

      <mesh position={[0, 0.28, 0.16]}>
        <boxGeometry args={[0.13, 0.025, 0.13]} />
        <meshStandardMaterial color="#b7b9b4" metalness={0.7} />
      </mesh>
    </group>
  )
}

function VoltageRegulator({
  selected,
}: {
  selected: boolean
}) {
  return (
    <group>
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[0.48, 0.17, 0.38]} />
        <ComponentMaterial
          color="#24282a"
          selected={selected}
        />
      </mesh>

      <mesh position={[0, 0.235, 0]}>
        <boxGeometry args={[0.3, 0.035, 0.23]} />
        <meshStandardMaterial
          color="#6d7474"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {[-0.17, 0, 0.17].map((x) => (
        <mesh key={x} position={[x, 0.07, 0.22]}>
          <boxGeometry args={[0.035, 0.05, 0.1]} />
          <meshStandardMaterial color="#c5a66d" metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Connectors({
  selected,
}: {
  selected: boolean
}) {
  return (
    <group>
      <mesh position={[-0.12, 0.2, 0]}>
        <boxGeometry args={[0.52, 0.38, 0.55]} />
        <ComponentMaterial
          color="#252a2c"
          selected={selected}
        />
      </mesh>

      <mesh position={[-0.12, 0.2, 0.285]}>
        <boxGeometry args={[0.36, 0.23, 0.025]} />
        <meshStandardMaterial color="#101416" />
      </mesh>

      {[-0.23, -0.12, -0.01, 0.1].map((x) => (
        <mesh key={x} position={[x, 0.2, 0.305]}>
          <boxGeometry args={[0.035, 0.13, 0.025]} />
          <meshStandardMaterial
            color="#b5a06e"
            metalness={0.85}
          />
        </mesh>
      ))}

      <mesh position={[0.62, 0.18, 0]}>
        <boxGeometry args={[0.4, 0.32, 0.45]} />
        <ComponentMaterial
          color="#d4d5cc"
          selected={selected}
          metalness={0.6}
        />
      </mesh>

      <mesh position={[0.62, 0.19, 0.235]}>
        <boxGeometry args={[0.25, 0.18, 0.025]} />
        <meshStandardMaterial color="#202629" />
      </mesh>
    </group>
  )
}

function Sensors({
  selected,
}: {
  selected: boolean
}) {
  return (
    <group>
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.5, 0.16, 0.42]} />
        <ComponentMaterial
          color="#252b2d"
          selected={selected}
        />
      </mesh>

      <mesh position={[0, 0.245, 0]}>
        <boxGeometry args={[0.25, 0.07, 0.22]} />
        <meshStandardMaterial
          color="#555f60"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0.12, 0.29, 0]}>
        <boxGeometry args={[0.055, 0.025, 0.055]} />
        <meshStandardMaterial color="#c4a36b" metalness={0.8} />
      </mesh>

      {[-0.16, 0.16].map((x) => (
        <mesh key={x} position={[x, 0.075, 0.25]}>
          <boxGeometry args={[0.035, 0.04, 0.1]} />
          <meshStandardMaterial color="#c5a66d" metalness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function PassiveComponents({
  selected,
}: {
  selected: boolean
}) {
  const capacitors = [
    [-0.48, 0.22, 0],
    [0.48, 0.22, 0],
  ]

  const resistors = [
    [-0.18, 0.14, 0.35],
    [0.18, 0.14, 0.35],
    [0, 0.14, -0.35],
  ]

  return (
    <group>
      {capacitors.map((position, index) => (
        <group
          key={`capacitor-${index}`}
          position={position as [number, number, number]}
        >
          <mesh>
            <cylinderGeometry args={[0.13, 0.13, 0.28, 24]} />
            <ComponentMaterial
              color="#343a3d"
              selected={selected}
            />
          </mesh>

          <mesh position={[0, 0.145, 0]}>
            <cylinderGeometry args={[0.105, 0.105, 0.015, 24]} />
            <meshStandardMaterial
              color="#b7b9b1"
              metalness={0.75}
            />
          </mesh>
        </group>
      ))}

      {resistors.map((position, index) => (
        <group
          key={`resistor-${index}`}
          position={position as [number, number, number]}
        >
          <mesh>
            <boxGeometry args={[0.28, 0.12, 0.13]} />
            <ComponentMaterial
              color="#c4a16b"
              selected={selected}
            />
          </mesh>

          <mesh position={[0, 0.066, 0]}>
            <boxGeometry args={[0.035, 0.008, 0.14]} />
            <meshStandardMaterial color="#704a36" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function ElectronicsModel({
  onSelect,
  selectedComponent,
  exploded,
}: ElectronicsModelProps) {
  return (
    <group rotation={[0.08, -0.28, 0]}>
      {/* 01 — PLACA DE CIRCUITO IMPRESSO */}

      <SelectablePart
        id="pcb"
        number="01"
        label="PLACA DE CIRCUITO"
        position={[0, 0, 0]}
        explodedOffset={0}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[0, -1.35, 3.0]}
        lineStart={[0, 0.1, 1.0]}
      >
        <CircuitBoard selected={selectedComponent === 'pcb'} />
      </SelectablePart>

      {/* 02 — MICROCONTROLADOR */}

      <SelectablePart
        id="microcontroller"
        number="02"
        label="MICROCONTROLADOR"
        position={[0, 0.08, 0]}
        explodedOffset={1.15}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[0, 2.15, -0.55]}
        lineStart={[0, 0.35, 0]}
      >
        <Microcontroller
          selected={selectedComponent === 'microcontroller'}
        />
      </SelectablePart>

      {/* 03 — REGULADOR DE TENSÃO */}

      <SelectablePart
        id="regulator"
        number="03"
        label="REGULADOR DE TENSÃO"
        position={[-1.05, 0.08, -0.65]}
        explodedOffset={0.85}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[-2.5, 1.45, -0.2]}
        lineStart={[0, 0.25, 0]}
      >
        <VoltageRegulator
          selected={selectedComponent === 'regulator'}
        />
      </SelectablePart>

      {/* 04 — CONECTORES */}

      <SelectablePart
        id="connectors"
        number="04"
        label="CONECTORES"
        position={[-1.35, 0.08, 0.55]}
        explodedOffset={0.95}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[-2.55, 1.1, 1.25]}
        lineStart={[-0.1, 0.3, 0.3]}
      >
        <Connectors
          selected={selectedComponent === 'connectors'}
        />
      </SelectablePart>

      {/* 05 — SENSORES */}

      <SelectablePart
        id="sensors"
        number="05"
        label="SENSORES"
        position={[1.05, 0.08, -0.65]}
        explodedOffset={0.9}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[2.5, 1.45, -0.2]}
        lineStart={[0, 0.3, 0]}
      >
        <Sensors
          selected={selectedComponent === 'sensors'}
        />
      </SelectablePart>

      {/* 06 — COMPONENTES PASSIVOS */}

      <SelectablePart
        id="passives"
        number="06"
        label="COMPONENTES PASSIVOS"
        position={[0, 0.08, 0.82]}
        explodedOffset={0.75}
        exploded={exploded}
        onSelect={onSelect}
        calloutPosition={[2.5, 1.15, 1.3]}
        lineStart={[0, 0.3, 0]}
      >
        <PassiveComponents
          selected={selectedComponent === 'passives'}
        />
      </SelectablePart>
    </group>
  )
}
