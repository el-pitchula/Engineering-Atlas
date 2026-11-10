
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SatelliteModelProps {
  onSelect: (component: string) => void
  selectedComponent: string
  exploded: boolean
}

function SolarPanel({
  onSelect,
  selected,
}: {
  onSelect: () => void
  selected: boolean
}) {
  const cells = []

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 5; col++) {
      cells.push({
        x: -0.68 + col * 0.34,
        y: -0.43 + row * 0.29,
      })
    }
  }

  return (
    <group>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onSelect()
        }}
      >
        <boxGeometry args={[1.7, 1.2, 0.07]} />
        <meshStandardMaterial
          color={selected ? '#668f45' : '#273d58'}
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>

      {cells.map((cell, index) => (
        <mesh
          key={index}
          position={[cell.x, cell.y, 0.041]}
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
        >
          <boxGeometry args={[0.29, 0.23, 0.012]} />
          <meshStandardMaterial
            color={selected ? '#a2d76c' : '#3679a9'}
            metalness={0.45}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function SatelliteModel({
  onSelect,
  selectedComponent,
  exploded,
}: SatelliteModelProps) {
  const bodyRef = useRef<THREE.Group>(null)
  const antennaRef = useRef<THREE.Group>(null)
  const leftPanelRef = useRef<THREE.Group>(null)
  const rightPanelRef = useRef<THREE.Group>(null)

  useFrame(() => {
    const speed = 0.08

    if (bodyRef.current) {
      const target = exploded ? -0.9 : 0
      bodyRef.current.position.z +=
        (target - bodyRef.current.position.z) * speed
    }

    if (antennaRef.current) {
      const target = exploded ? 2.1 : 0.9
      antennaRef.current.position.y +=
        (target - antennaRef.current.position.y) * speed
    }

    if (leftPanelRef.current) {
      const target = exploded ? -3.2 : -1.55
      leftPanelRef.current.position.x +=
        (target - leftPanelRef.current.position.x) * speed
    }

    if (rightPanelRef.current) {
      const target = exploded ? 3.2 : 1.55
      rightPanelRef.current.position.x +=
        (target - rightPanelRef.current.position.x) * speed
    }
  })

  const structureSelected = selectedComponent === 'structure'
  const antennaSelected = selectedComponent === 'antenna'
  const panelsSelected = selectedComponent === 'solar-panels'

  return (
    <group>
      {/* Corpo estrutural */}
      <group ref={bodyRef}>
        <mesh
          onClick={(event) => {
            event.stopPropagation()
            onSelect('structure')
          }}
        >
          <boxGeometry args={[1.25, 1.1, 1.1]} />
          <meshStandardMaterial
            color={structureSelected ? '#c6f36a' : '#b7b8b0'}
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>

        <mesh
          position={[0, 0, 0.56]}
          onClick={(event) => {
            event.stopPropagation()
            onSelect('structure')
          }}
        >
          <boxGeometry args={[0.8, 0.72, 0.025]} />
          <meshStandardMaterial color="#d4c9a4" metalness={0.5} />
        </mesh>
      </group>

      {/* Equipamentos internos: revelados na vista explodida */}
      {exploded && (
        <group>
          {/* Bateria */}
          <mesh
            position={[-0.35, -0.85, 0.25]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('battery')
            }}
          >
            <boxGeometry args={[0.48, 0.35, 0.38]} />
            <meshStandardMaterial color="#b58b43" metalness={0.6} />
          </mesh>

          {/* Computador de bordo */}
          <mesh
            position={[0.35, -0.85, 0.25]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('computer')
            }}
          >
            <boxGeometry args={[0.48, 0.35, 0.38]} />
            <meshStandardMaterial color="#548b78" metalness={0.5} />
          </mesh>

          {/* Carga útil */}
          <mesh
            position={[0, 0.85, 0.25]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('payload')
            }}
          >
            <boxGeometry args={[0.65, 0.35, 0.5]} />
            <meshStandardMaterial color="#7389a6" metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* Antena */}
      <group ref={antennaRef} position={[0, 0.9, 0.1]}>
        <group rotation={[0.35, 0, 0]}>
          <mesh
            position={[0, 0.28, 0]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('antenna')
            }}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.55, 12]} />
            <meshStandardMaterial color="#b9b9ad" metalness={0.8} />
          </mesh>

          <mesh
            position={[0, 0.55, 0]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('antenna')
            }}
          >
            <circleGeometry args={[0.42, 48]} />
            <meshStandardMaterial
              color={antennaSelected ? '#c6f36a' : '#d6d2bd'}
              side={THREE.DoubleSide}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>

          <mesh position={[0, 0.55, 0.035]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#c6f36a" emissive="#526b21" />
          </mesh>
        </group>
      </group>

      {/* Painel solar esquerdo */}
      <group ref={leftPanelRef} position={[-1.55, 0, 0]}>
        <SolarPanel
          onSelect={() => onSelect('solar-panels')}
          selected={panelsSelected}
        />
      </group>

      {/* Painel solar direito */}
      <group ref={rightPanelRef} position={[1.55, 0, 0]}>
        <SolarPanel
          onSelect={() => onSelect('solar-panels')}
          selected={panelsSelected}
        />
      </group>

      {/* Conectores */}
      <mesh position={[-0.95, 0, 0]}>
        <boxGeometry args={[0.65, 0.08, 0.08]} />
        <meshStandardMaterial color="#9a9e95" metalness={0.8} />
      </mesh>

      <mesh position={[0.95, 0, 0]}>
        <boxGeometry args={[0.65, 0.08, 0.08]} />
        <meshStandardMaterial color="#9a9e95" metalness={0.8} />
      </mesh>
    </group>
  )
}
