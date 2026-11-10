
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface SatelliteModelProps {
  onSelect: (component: string) => void
  selectedComponent: string
  exploded: boolean
}

interface CalloutProps {
  number: string
  title: string
  active: boolean
  position: [number, number, number]
  points: [number, number, number][]
}

function Callout({
  number,
  title,
  active,
  position,
  points,
}: CalloutProps) {
  const color = active ? '#c6f36a' : '#9da99a'

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={active ? 2 : 1}
        transparent
        opacity={active ? 1 : 0.75}
      />

      <Html
        position={position}
        center
        style={{
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '7px 10px',
            border: `1px solid ${color}`,
            borderRadius: '4px',
            background: 'rgba(16, 23, 19, 0.94)',
            color: active ? '#c6f36a' : '#d5ddd1',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            boxShadow: active
              ? '0 0 12px rgba(198, 243, 106, 0.2)'
              : 'none',
          }}
        >
          <strong>{number}</strong>
          <span>{title}</span>
        </div>
      </Html>
    </group>
  )
}

function SolarPanel({
  onSelect,
  selected,
}: {
  onSelect: () => void
  selected: boolean
}) {
  const cells = []

  // Duas colunas e oito fileiras de células
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 2; col++) {
      cells.push({
        x: -0.22 + col * 0.44,
        y: -1.33 + row * 0.38,
      })
    }
  }

  return (
    <group>
      {/* Base estrutural do painel */}
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onSelect()
        }}
      >
        <boxGeometry args={[0.9, 3.2, 0.07]} />
        <meshStandardMaterial
          color={selected ? '#668f45' : '#273d58'}
          metalness={0.65}
          roughness={0.35}
        />
      </mesh>

      {/* Células fotovoltaicas */}
      {cells.map((cell, index) => (
        <mesh
          key={index}
          position={[cell.x, cell.y, 0.041]}
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
        >
          <boxGeometry args={[0.36, 0.32, 0.012]} />
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
      const target = exploded ? 2.35 : 1.65

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
  const batterySelected = selectedComponent === 'battery'
  const computerSelected = selectedComponent === 'computer'
  const payloadSelected = selectedComponent === 'payload'

  return (
    <group>
      {/* ESTRUTURA PRIMÁRIA — CUBESAT 3U */}
      <group ref={bodyRef}>
        {/* Quatro trilhos longitudinais */}
        {[-1, 1].flatMap((x) =>
          [-1, 1].map((z) => (
            <mesh
              key={`${x}-${z}`}
              position={[x * 0.455, 0, z * 0.455]}
              onClick={(event) => {
                event.stopPropagation()
                onSelect('structure')
              }}
            >
              <boxGeometry args={[0.085, 3.405, 0.085]} />
              <meshStandardMaterial
                color={structureSelected ? '#c6f36a' : '#b7b8b0'}
                metalness={0.8}
                roughness={0.3}
              />
            </mesh>
          ))
        )}

        {/* Placas estruturais das extremidades */}
        {[-1, 1].map((y) => (
          <mesh
            key={y}
            position={[0, y * 1.66, 0]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('structure')
            }}
          >
            <boxGeometry args={[1, 0.08, 1]} />
            <meshStandardMaterial
              color={structureSelected ? '#c6f36a' : '#929991'}
              metalness={0.8}
              roughness={0.35}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}

        {/* Travessas de sustentação */}
        {[-0.55, 0.55].map((y) => (
          <mesh
            key={y}
            position={[0, y, 0]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('structure')
            }}
          >
            <boxGeometry args={[0.9, 0.055, 0.9]} />
            <meshStandardMaterial
              color="#9da49a"
              metalness={0.75}
            />
          </mesh>
        ))}

        {exploded && (
          <Callout
            number="01"
            title="Estrutura primária"
            active={structureSelected}
            points={[
              [0.45, 0.5, 0.4],
              [0.95, 0.65, 0.2],
              [1.35, 0.65, 0.2],
            ]}
            position={[1.65, 0.65, 0.2]}
          />
        )}
      </group>


      {/* MÓDULOS INTERNOS */}
      {exploded && (
        <group>
          {/* 04 — BATERIA */}
          <group position={[-0.35, -1.05, 0.25]}>
            {/* Estrutura de suporte */}
            <mesh
              onClick={(event) => {
                event.stopPropagation()
                onSelect('battery')
              }}
            >
              <boxGeometry args={[0.48, 0.35, 0.38]} />
              <meshStandardMaterial
                color="#8c7449"
                metalness={0.65}
                roughness={0.4}
              />
            </mesh>

            {/* Células da bateria */}
            {[-0.14, 0, 0.14].map((x) => (
              <mesh
                key={x}
                position={[x, 0, 0.195]}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect('battery')
                }}
              >
                <boxGeometry args={[0.105, 0.27, 0.025]} />
                <meshStandardMaterial
                  color={batterySelected ? '#c6f36a' : '#d5bd82'}
                  metalness={0.55}
                  roughness={0.35}
                />
              </mesh>
            ))}

            <Callout
              number="04"
              title="Bateria"
              active={batterySelected}
              points={[
                [-0.15, 0.12, 0.2],
                [-0.65, 0.45, 0.2],
                [-0.95, 0.45, 0.2],
              ]}
              position={[-1.25, 0.45, 0.2]}
            />
          </group>

          {/* 05 — COMPUTADOR DE BORDO */}
          <group position={[0.35, -0.1, 0.25]}>
            {/* Placa eletrônica */}
            <mesh
              onClick={(event) => {
                event.stopPropagation()
                onSelect('computer')
              }}
            >
              <boxGeometry args={[0.48, 0.055, 0.38]} />
              <meshStandardMaterial
                color={computerSelected ? '#c6f36a' : '#286c58'}
                metalness={0.4}
                roughness={0.5}
              />
            </mesh>

            {/* Processador principal */}
            <mesh
              position={[0, 0.045, 0]}
              onClick={(event) => {
                event.stopPropagation()
                onSelect('computer')
              }}
            >
              <boxGeometry args={[0.17, 0.055, 0.17]} />
              <meshStandardMaterial
                color="#343b40"
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>

            {/* Componentes auxiliares */}
            {[
              [-0.15, 0, -0.12],
              [0.15, 0, -0.12],
              [-0.15, 0, 0.12],
              [0.15, 0, 0.12],
            ].map((position, index) => (
              <mesh
                key={index}
                position={[position[0], 0.045, position[2]]}
                onClick={(event) => {
                  event.stopPropagation()
                  onSelect('computer')
                }}
              >
                <boxGeometry args={[0.075, 0.035, 0.065]} />
                <meshStandardMaterial
                  color="#b8a76e"
                  metalness={0.65}
                />
              </mesh>
            ))}

            <Callout
              number="05"
              title="Computador de bordo"
              active={computerSelected}
              points={[
                [0.15, 0.12, 0.2],
                [0.65, 0.45, 0.2],
                [0.95, 0.45, 0.2],
              ]}
              position={[1.35, 0.45, 0.2]}
            />
          </group>

          {/* 06 — CARGA ÚTIL */}
          <group position={[0, 1.05, 0.25]}>
            {/* Corpo do instrumento */}
            <mesh
              onClick={(event) => {
                event.stopPropagation()
                onSelect('payload')
              }}
            >
              <boxGeometry args={[0.65, 0.35, 0.5]} />
              <meshStandardMaterial
                color={payloadSelected ? '#c6f36a' : '#7389a6'}
                metalness={0.6}
                roughness={0.35}
              />
            </mesh>

            {/* Tubo óptico */}
            <mesh
              position={[0, 0, 0.29]}
              rotation={[Math.PI / 2, 0, 0]}
              onClick={(event) => {
                event.stopPropagation()
                onSelect('payload')
              }}
            >
              <cylinderGeometry args={[0.15, 0.15, 0.18, 32]} />
              <meshStandardMaterial
                color="#aeb6bd"
                metalness={0.8}
                roughness={0.25}
              />
            </mesh>

            {/* Lente */}
            <mesh
              position={[0, 0, 0.39]}
              onClick={(event) => {
                event.stopPropagation()
                onSelect('payload')
              }}
            >
              <circleGeometry args={[0.115, 32]} />
              <meshStandardMaterial
                color="#315c83"
                metalness={0.75}
                roughness={0.15}
                side={THREE.DoubleSide}
              />
            </mesh>

            <Callout
              number="06"
              title="Carga útil"
              active={payloadSelected}
              points={[
                [0.25, 0.12, 0.2],
                [0.65, 0.45, 0.2],
                [0.65, 0.75, 0.2],
              ]}
              position={[0.65, 1.05, 0.2]}
            />
          </group>
        </group>
      )}

      {/* ANTENA DE COMUNICAÇÃO */}
      <group ref={antennaRef} position={[0, 1.65, 0.1]}>
        <group rotation={[0.35, 0, 0]}>
          <mesh
            position={[0, 0.28, 0]}
            onClick={(event) => {
              event.stopPropagation()
              onSelect('antenna')
            }}
          >
            <cylinderGeometry args={[0.035, 0.035, 0.55, 12]} />
            <meshStandardMaterial
              color="#b9b9ad"
              metalness={0.8}
            />
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
            <meshStandardMaterial
              color="#c6f36a"
              emissive="#526b21"
            />
          </mesh>
        </group>

        {exploded && (
          <Callout
            number="03"
            title="Antena de comunicação"
            active={antennaSelected}
            points={[
              [0.1, 0.55, 0],
              [0.65, 0.85, 0],
              [0.95, 0.85, 0],
            ]}
            position={[1.35, 0.85, 0]}
          />
        )}
      </group>

      {/* PAINEL SOLAR ESQUERDO */}
      <group ref={leftPanelRef} position={[-1.55, 0, 0]}>
        <SolarPanel
          onSelect={() => onSelect('solar-panels')}
          selected={panelsSelected}
        />
      </group>

      {/* PAINEL SOLAR DIREITO */}
      <group ref={rightPanelRef} position={[1.55, 0, 0]}>
        <SolarPanel
          onSelect={() => onSelect('solar-panels')}
          selected={panelsSelected}
        />

        {exploded && (
          <Callout
            number="02"
            title="Painéis solares"
            active={panelsSelected}
            points={[
              [0.65, 0.45, 0.05],
              [1.0, 0.85, 0.15],
              [1.25, 0.85, 0.15],
            ]}
            position={[1.65, 0.85, 0.15]}
          />
        )}
      </group>

      {/* CONECTORES */}
      <mesh position={[-0.95, 0, 0]}>
        <boxGeometry args={[0.65, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#9a9e95"
          metalness={0.8}
        />
      </mesh>

      <mesh position={[0.95, 0, 0]}>
        <boxGeometry args={[0.65, 0.08, 0.08]} />
        <meshStandardMaterial
          color="#9a9e95"
          metalness={0.8}
        />
      </mesh>
    </group>
  )
}
