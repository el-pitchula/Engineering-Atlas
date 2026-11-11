
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { ThreeEvent } from '@react-three/fiber'
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

const COLORS = {
  aluminum: '#aebdca',
  aluminumDark: '#657789',
  blue: '#315f91',
  blueLight: '#5d91c3',
  red: '#e05252',
  gold: '#c5a66a',
  pcb: '#28634f',
  pcbDark: '#174332',
  black: '#202b36',
  white: '#e1e8ee',
}

function Callout({
  number,
  title,
  active,
  position,
  points,
}: CalloutProps) {
  const color = active ? '#e05252' : '#8bb9e8'

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
            borderRadius: '3px',
            background: 'rgba(9, 20, 35, 0.96)',
            color: active ? '#ffffff' : '#c7d8e9',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            boxShadow: active
              ? '0 0 14px rgba(224, 82, 82, 0.25)'
              : 'none',
          }}
        >
          <strong style={{ color }}>{number}</strong>
          <span>{title}</span>
        </div>
      </Html>
    </group>
  )
}

/* PARAFUSOS E FIXADORES */

function Fastener({
  position,
  color = '#c3cbd2',
}: {
  position: [number, number, number]
  color?: string
}) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.032, 0.032, 0.018, 12]} />
        <meshStandardMaterial
          color={color}
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0, 0.011]}>
        <boxGeometry args={[0.025, 0.004, 0.006]} />
        <meshStandardMaterial color="#384653" metalness={0.7} />
      </mesh>
    </group>
  )
}

/* PAINÉIS SOLARES */

function SolarPanel({
  onSelect,
  selected,
}: {
  onSelect: () => void
  selected: boolean
}) {
  const cells = []

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 2; col++) {
      cells.push({
        x: -0.215 + col * 0.43,
        y: -1.32 + row * 0.375,
      })
    }
  }

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  return (
    <group>
      <mesh onClick={handleClick}>
        <boxGeometry args={[0.98, 3.25, 0.075]} />
        <meshStandardMaterial
          color="#263d56"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>

      {[-0.47, 0.47].map((x) => (
        <mesh key={x} position={[x, 0, 0.045]} onClick={handleClick}>
          <boxGeometry args={[0.035, 3.3, 0.035]} />
          <meshStandardMaterial
            color={COLORS.aluminum}
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      ))}

      {[-1.62, 1.62].map((y) => (
        <mesh key={y} position={[0, y, 0.045]} onClick={handleClick}>
          <boxGeometry args={[0.98, 0.035, 0.035]} />
          <meshStandardMaterial
            color={COLORS.aluminum}
            metalness={0.85}
            roughness={0.28}
          />
        </mesh>
      ))}

      {cells.map((cell, index) => (
        <mesh
          key={index}
          position={[cell.x, cell.y, 0.045]}
          onClick={handleClick}
        >
          <boxGeometry args={[0.395, 0.345, 0.014]} />
          <meshStandardMaterial
            color={selected ? '#79a9d5' : '#285d8c'}
            metalness={0.55}
            roughness={0.25}
            emissive={selected ? '#183d60' : '#071b30'}
          />
        </mesh>
      ))}

      {[-0.9, -0.48, 0, 0.48, 0.9].map((y) => (
        <mesh key={y} position={[0, y, 0.055]}>
          <boxGeometry args={[0.86, 0.008, 0.004]} />
          <meshStandardMaterial color="#8bb9e8" />
        </mesh>
      ))}

      {[-0.4, 0.4].map((x) =>
        [-1.55, 1.55].map((y) => (
          <Fastener key={`${x}-${y}`} position={[x, y, 0.07]} />
        ))
      )}
    </group>
  )
}

/* ESTRUTURA PRINCIPAL */

function SatelliteStructure({
  selected,
  onSelect,
  exploded,
}: {
  selected: boolean
  onSelect: () => void
  exploded: boolean
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  const railPositions = [-1, 1]
  const bracketHeights = [-1.25, 0, 1.25]

  return (
    <group>
      {/* QUATRO TRILHOS ESTRUTURAIS */}

      {railPositions.flatMap((x) =>
        railPositions.map((z) => (
          <group
            key={`rail-${x}-${z}`}
            position={[x * 0.455, 0, z * 0.455]}
          >
            <mesh onClick={handleClick}>
              <boxGeometry args={[0.085, 3.405, 0.085]} />
              <meshStandardMaterial
                color={selected ? '#e05252' : COLORS.aluminum}
                metalness={0.9}
                roughness={0.24}
              />
            </mesh>

            <mesh
              position={[-x * 0.026, 0, -z * 0.026]}
              onClick={handleClick}
            >
              <boxGeometry args={[0.022, 3.25, 0.022]} />
              <meshStandardMaterial
                color={COLORS.aluminumDark}
                metalness={0.85}
                roughness={0.32}
              />
            </mesh>

            <mesh
              position={[x * 0.044, 0, z * 0.044]}
              onClick={handleClick}
            >
              <boxGeometry args={[0.008, 3.28, 0.008]} />
              <meshStandardMaterial
                color="#d9e1e8"
                metalness={0.95}
                roughness={0.2}
              />
            </mesh>

            {/* ABRAÇADEIRAS DE FIXAÇÃO */}

            {bracketHeights.map((y) => (
              <group key={`bracket-${y}`} position={[0, y, 0]}>
                <mesh onClick={handleClick}>
                  <boxGeometry args={[0.112, 0.105, 0.112]} />
                  <meshStandardMaterial
                    color="#657789"
                    metalness={0.9}
                    roughness={0.3}
                  />
                </mesh>

                <mesh position={[0, 0.055, 0]}>
                  <boxGeometry args={[0.12, 0.012, 0.12]} />
                  <meshStandardMaterial
                    color="#c4cdd5"
                    metalness={0.9}
                    roughness={0.22}
                  />
                </mesh>
              </group>
            ))}
          </group>
        ))
      )}

      {/* PLACAS DE EXTREMIDADE */}

      {[-1, 1].map((y) => (
        <group key={`endplate-${y}`} position={[0, y * 1.66, 0]}>
          <mesh onClick={handleClick}>
            <boxGeometry args={[1.02, 0.085, 1.02]} />
            <meshStandardMaterial
              color={selected ? '#e05252' : '#8294a5'}
              metalness={0.9}
              roughness={0.28}
            />
          </mesh>

          {/* PAINEL CENTRAL */}

          <mesh position={[0, y * 0.047, 0]}>
            <boxGeometry args={[0.72, 0.012, 0.72]} />
            <meshStandardMaterial
              color="#465c70"
              metalness={0.8}
              roughness={0.38}
            />
          </mesh>

          {/* MOLDURA DE ACABAMENTO */}

          {[-0.38, 0.38].map((offset) => (
            <group key={offset}>
              <mesh
                position={[offset, y * 0.05, 0]}
                onClick={handleClick}
              >
                <boxGeometry args={[0.018, 0.012, 0.78]} />
                <meshStandardMaterial
                  color="#c2cbd3"
                  metalness={0.95}
                  roughness={0.22}
                />
              </mesh>

              <mesh
                position={[0, y * 0.05, offset]}
                onClick={handleClick}
              >
                <boxGeometry args={[0.78, 0.012, 0.018]} />
                <meshStandardMaterial
                  color="#c2cbd3"
                  metalness={0.95}
                  roughness={0.22}
                />
              </mesh>
            </group>
          ))}

          {/* FIXADORES */}

          {[-0.39, 0.39].map((x) =>
            [-0.39, 0.39].map((z) => (
              <Fastener
                key={`${x}-${z}`}
                position={[x, y * 0.052, z]}
              />
            ))
          )}
        </group>
      ))}

      {/* REFORÇOS TRANSVERSAIS INTERNOS */}

      {[-0.55, 0.55].map((y) => (
        <mesh
          key={`crossbrace-${y}`}
          position={[0, y, 0]}
          onClick={handleClick}
        >
          <boxGeometry args={[0.9, 0.055, 0.9]} />
          <meshStandardMaterial
            color="#8799a8"
            metalness={0.88}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* CHAPAS LATERAIS DE REFORÇO */}

      {[-1, 1].map((x) => (
        <group key={`side-${x}`} position={[x * 0.44, 0, 0]}>
          <mesh onClick={handleClick}>
            <boxGeometry args={[0.025, 2.8, 0.48]} />
            <meshStandardMaterial
              color="#566b7d"
              metalness={0.85}
              roughness={0.38}
              transparent
              opacity={0.65}
            />
          </mesh>

          {[-0.7, 0, 0.7].map((y) => (
            <mesh
              key={y}
              position={[x * 0.014, y, 0]}
              onClick={handleClick}
            >
              <boxGeometry args={[0.008, 0.018, 0.4]} />
              <meshStandardMaterial
                color="#c1ccd5"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* IDENTIFICAÇÃO DA ESTRUTURA */}

      {exploded && (
        <Callout
          number="01"
          title="Estrutura primária"
          active={selected}
          points={[
            [0.45, 0.5, 0.4],
            [0.95, 0.65, 0.2],
            [1.35, 0.65, 0.2],
          ]}
          position={[1.65, 0.65, 0.2]}
        />
      )}
    </group>
  )
}

/* BATERIA */

function BatteryModule({
  selected,
  onSelect,
}: {
  selected: boolean
  onSelect: () => void
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  return (
    <group>
      <mesh onClick={handleClick}>
        <boxGeometry args={[0.54, 0.38, 0.43]} />
        <meshStandardMaterial
          color={selected ? '#e05252' : '#596a79'}
          metalness={0.75}
          roughness={0.35}
        />
      </mesh>

      {[-0.16, 0, 0.16].map((x) => (
        <group key={x} position={[x, 0, 0.225]}>
          <mesh onClick={handleClick}>
            <boxGeometry args={[0.125, 0.29, 0.035]} />
            <meshStandardMaterial
              color={selected ? '#e05252' : '#d2bd8b'}
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>

          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.075, 0.012, 0.02]} />
            <meshStandardMaterial color="#7b8993" metalness={0.8} />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.48, 0.025, 0.37]} />
        <meshStandardMaterial
          color="#9ba8b0"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0.25, 0.12, -0.12]}>
        <boxGeometry args={[0.08, 0.1, 0.12]} />
        <meshStandardMaterial color={COLORS.gold} metalness={0.8} />
      </mesh>
    </group>
  )
}

/* COMPUTADOR DE BORDO */

function ComputerModule({
  selected,
  onSelect,
}: {
  selected: boolean
  onSelect: () => void
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  const components = [
    [-0.18, -0.14],
    [0.18, -0.14],
    [-0.18, 0.14],
    [0.18, 0.14],
  ]

  return (
    <group>
      <mesh onClick={handleClick}>
        <boxGeometry args={[0.56, 0.055, 0.46]} />
        <meshStandardMaterial
          color={selected ? '#477c68' : COLORS.pcb}
          metalness={0.35}
          roughness={0.5}
        />
      </mesh>

      <mesh position={[0, -0.033, 0]}>
        <boxGeometry args={[0.52, 0.012, 0.42]} />
        <meshStandardMaterial color={COLORS.pcbDark} />
      </mesh>

      <mesh position={[0, 0.06, 0]} onClick={handleClick}>
        <boxGeometry args={[0.19, 0.07, 0.19]} />
        <meshStandardMaterial
          color={selected ? '#e05252' : '#303d49'}
          metalness={0.75}
          roughness={0.25}
        />
      </mesh>

      {components.map(([x, z], index) => (
        <mesh
          key={index}
          position={[x, 0.045, z]}
          onClick={handleClick}
        >
          <boxGeometry args={[0.085, 0.035, 0.075]} />
          <meshStandardMaterial
            color={COLORS.gold}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}

      {[-0.23, 0.23].map((x) => (
        <mesh
          key={x}
          position={[x, 0.055, 0]}
          onClick={handleClick}
        >
          <cylinderGeometry args={[0.035, 0.035, 0.045, 12]} />
          <meshStandardMaterial color="#aeb7bd" metalness={0.8} />
        </mesh>
      ))}

      {[-1, 1].map((x) => (
        <mesh key={x} position={[x * 0.29, 0.025, 0]}>
          <boxGeometry args={[0.065, 0.075, 0.2]} />
          <meshStandardMaterial color="#c1c8cd" metalness={0.85} />
        </mesh>
      ))}

      {[-0.1, 0.1].map((z) => (
        <mesh key={z} position={[0, 0.029, z]}>
          <boxGeometry args={[0.42, 0.005, 0.006]} />
          <meshStandardMaterial color="#c5a66a" metalness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

/* CARGA ÚTIL / INSTRUMENTO ÓPTICO */

function PayloadModule({
  selected,
  onSelect,
}: {
  selected: boolean
  onSelect: () => void
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  return (
    <group>
      <mesh onClick={handleClick}>
        <boxGeometry args={[0.65, 0.38, 0.5]} />
        <meshStandardMaterial
          color={selected ? '#e05252' : '#657f99'}
          metalness={0.75}
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0, 0.27]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.055, 32]} />
        <meshStandardMaterial
          color="#bac5ce"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.36]}
        rotation={[Math.PI / 2, 0, 0]}
        onClick={handleClick}
      >
        <cylinderGeometry args={[0.145, 0.145, 0.22, 32]} />
        <meshStandardMaterial
          color="#273b51"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>

      <mesh position={[0, 0, 0.48]} onClick={handleClick}>
        <circleGeometry args={[0.115, 32]} />
        <meshPhysicalMaterial
          color="#477ba8"
          metalness={0.65}
          roughness={0.12}
          clearcoat={1}
          clearcoatRoughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0.49]}>
        <torusGeometry args={[0.125, 0.012, 8, 32]} />
        <meshStandardMaterial color={COLORS.aluminum} metalness={0.9} />
      </mesh>

      {[-0.23, 0.23].map((x) =>
        [-0.13, 0.13].map((y) => (
          <Fastener key={`${x}-${y}`} position={[x, y, 0.255]} />
        ))
      )}
    </group>
  )
}

/* ANTENA DE COMUNICAÇÃO */

function CommunicationAntenna({
  selected,
  onSelect,
}: {
  selected: boolean
  onSelect: () => void
}) {
  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelect()
  }

  return (
    <group rotation={[0.35, 0, 0]}>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.12, 0.14, 0.09, 24]} />
        <meshStandardMaterial
          color={COLORS.aluminumDark}
          metalness={0.85}
        />
      </mesh>

      <mesh position={[0, 0.32, 0]} onClick={handleClick}>
        <cylinderGeometry args={[0.035, 0.045, 0.55, 16]} />
        <meshStandardMaterial
          color={COLORS.aluminum}
          metalness={0.9}
          roughness={0.22}
        />
      </mesh>

      <mesh position={[0, 0.58, 0]} onClick={handleClick}>
        <circleGeometry args={[0.42, 48]} />
        <meshStandardMaterial
          color={selected ? '#e05252' : '#c4cbd1'}
          side={THREE.DoubleSide}
          metalness={0.85}
          roughness={0.22}
        />
      </mesh>

      <mesh position={[0, 0.58, 0]}>
        <torusGeometry args={[0.415, 0.018, 8, 48]} />
        <meshStandardMaterial color={COLORS.aluminum} metalness={0.9} />
      </mesh>

      <mesh position={[0, 0.58, 0.04]}>
        <sphereGeometry args={[0.065, 20, 20]} />
        <meshStandardMaterial
          color={COLORS.gold}
          metalness={0.85}
          emissive="#33200b"
        />
      </mesh>
    </group>
  )
}

/* MODELO COMPLETO DO SATÉLITE */

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
      <group ref={bodyRef}>
        <SatelliteStructure
          selected={structureSelected}
          onSelect={() => onSelect('structure')}
          exploded={exploded}
        />
      </group>

      {exploded && (
        <group>
          <group position={[-0.35, -1.05, 0.25]}>
            <BatteryModule
              selected={batterySelected}
              onSelect={() => onSelect('battery')}
            />

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

          <group position={[0.35, -0.1, 0.25]}>
            <ComputerModule
              selected={computerSelected}
              onSelect={() => onSelect('computer')}
            />

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

          <group position={[0, 1.05, 0.25]}>
            <PayloadModule
              selected={payloadSelected}
              onSelect={() => onSelect('payload')}
            />

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

      <group ref={antennaRef} position={[0, 1.65, 0.1]}>
        <CommunicationAntenna
          selected={antennaSelected}
          onSelect={() => onSelect('antenna')}
        />

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

      <group ref={leftPanelRef} position={[-1.55, 0, 0]}>
        <SolarPanel
          onSelect={() => onSelect('solar-panels')}
          selected={panelsSelected}
        />
      </group>

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

      {[-1, 1].map((x) => (
        <group key={x} position={[x * 0.95, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.65, 0.08, 0.08]} />
            <meshStandardMaterial
              color={COLORS.aluminumDark}
              metalness={0.9}
              roughness={0.25}
            />
          </mesh>

          <mesh position={[0, 0, 0.045]}>
            <boxGeometry args={[0.4, 0.035, 0.015]} />
            <meshStandardMaterial
              color={COLORS.gold}
              metalness={0.8}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
