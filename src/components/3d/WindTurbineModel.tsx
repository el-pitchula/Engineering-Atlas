
import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'

interface WindTurbineModelProps {
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

/**
 * Cria uma pá curva com seção transversal de aerofólio NACA 0015.
 *
 * A geometria é construída por seções transversais ao longo
 * de uma curva, evitando a seção circular de TubeGeometry.
 */
function createAirfoilBladeGeometry() {
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.48, -1.55, 0),
    new THREE.Vector3(0.82, -1.15, 0),
    new THREE.Vector3(1.08, -0.55, 0),
    new THREE.Vector3(1.17, 0, 0),
    new THREE.Vector3(1.08, 0.55, 0),
    new THREE.Vector3(0.82, 1.15, 0),
    new THREE.Vector3(0.48, 1.55, 0),
  ])

  const spanSegments = 64
  const chordSegments = 20
  const chordLength = 0.34
  const thicknessRatio = 0.15

  const profile: { x: number; y: number }[] = []

  // Superfície superior do aerofólio
  for (let i = 0; i <= chordSegments; i++) {
    const x = i / chordSegments

    const thickness =
      5 *
      thicknessRatio *
      (
        0.2969 * Math.sqrt(x) -
        0.1260 * x -
        0.3516 * x ** 2 +
        0.2843 * x ** 3 -
        0.1015 * x ** 4
      )

    profile.push({ x, y: thickness })
  }

  // Superfície inferior do aerofólio
  for (let i = chordSegments - 1; i >= 1; i--) {
    const x = i / chordSegments

    const thickness =
      5 *
      thicknessRatio *
      (
        0.2969 * Math.sqrt(x) -
        0.1260 * x -
        0.3516 * x ** 2 +
        0.2843 * x ** 3 -
        0.1015 * x ** 4
      )

    profile.push({ x, y: -thickness })
  }

  const profileSegments = profile.length
  const positions: number[] = []
  const indices: number[] = []

  // Geração das seções ao longo da curvatura da pá
  for (let i = 0; i <= spanSegments; i++) {
    const t = i / spanSegments
    const point = path.getPointAt(t)
    const tangent = path.getTangentAt(t).normalize()

    // Direção da corda, perpendicular ao percurso da pá
    const chordDirection = new THREE.Vector3(
      -tangent.y,
      tangent.x,
      0
    ).normalize()

    // Direção da espessura do aerofólio
    const thicknessDirection = new THREE.Vector3(0, 0, 1)

    for (const section of profile) {
      const chordOffset = (section.x - 0.5) * chordLength
      const thicknessOffset = section.y * chordLength

      const vertex = point.clone()
        .addScaledVector(chordDirection, chordOffset)
        .addScaledVector(thicknessDirection, thicknessOffset)

      positions.push(vertex.x, vertex.y, vertex.z)
    }
  }

  // Conexão entre as seções transversais
  for (let i = 0; i < spanSegments; i++) {
    for (let j = 0; j < profileSegments; j++) {
      const nextJ = (j + 1) % profileSegments

      const a = i * profileSegments + j
      const b = (i + 1) * profileSegments + j
      const c = (i + 1) * profileSegments + nextJ
      const d = i * profileSegments + nextJ

      indices.push(a, b, d)
      indices.push(b, c, d)
    }
  }

  // Fechamento da extremidade inferior
  const startCenter = positions.length / 3
  const startPoint = path.getPointAt(0)

  positions.push(
    startPoint.x,
    startPoint.y,
    startPoint.z
  )

  for (let j = 0; j < profileSegments; j++) {
    const nextJ = (j + 1) % profileSegments

    indices.push(
      startCenter,
      nextJ,
      j
    )
  }

  // Fechamento da extremidade superior
  const endCenter = positions.length / 3
  const endPoint = path.getPointAt(1)
  const endOffset = spanSegments * profileSegments

  positions.push(
    endPoint.x,
    endPoint.y,
    endPoint.z
  )

  for (let j = 0; j < profileSegments; j++) {
    const nextJ = (j + 1) % profileSegments

    indices.push(
      endCenter,
      endOffset + j,
      endOffset + nextJ
    )
  }

  const geometry = new THREE.BufferGeometry()

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  )

  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()

  return geometry
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
        color={active ? '#e5bd70' : '#858b94'}
        lineWidth={1}
      />

      <Html
        position={[0, 0.34, 0]}
        center
        distanceFactor={8}
        zIndexRange={[100, 0]}
        occlude={false}
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
            padding: active ? '7px 11px' : '6px 9px',
            background: active
              ? 'rgba(181, 139, 61, 0.97)'
              : 'rgba(25, 26, 22, 0.95)',
            border: `1px solid ${active ? '#f0d18a' : '#626653'}`,
            borderRadius: '3px',
            color: active ? '#ffffff' : '#d5d5ca',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.04em',
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            boxShadow: active
              ? '0 0 16px rgba(229, 189, 112, 0.35)'
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

          <span>{label}</span>
        </div>
      </Html>
    </group>
  )
}

export default function WindTurbineModel({
  onSelect,
  selectedComponent,
  exploded,
}: WindTurbineModelProps) {
  const bladesRef = useRef<THREE.Group>(null)
  const armsRef = useRef<THREE.Group>(null)
  const shaftRef = useRef<THREE.Group>(null)
  const bearingsRef = useRef<THREE.Group>(null)
  const generatorRef = useRef<THREE.Group>(null)

  // A geometria é compartilhada pelas três pás
  const bladeGeometry = useMemo(
    () => createAirfoilBladeGeometry(),
    []
  )

  useFrame((_, delta) => {
    const movements = [
      {
        ref: bladesRef,
        integrated: 0,
        separated: 0.9,
      },
      {
        ref: armsRef,
        integrated: 0,
        separated: 0.45,
      },
      {
        ref: shaftRef,
        integrated: 0,
        separated: 0,
      },
      {
        ref: bearingsRef,
        integrated: 0,
        separated: -0.4,
      },
      {
        ref: generatorRef,
        integrated: 0,
        separated: -0.8,
      },
    ]

    movements.forEach(({ ref, integrated, separated }) => {
      if (!ref.current) return

      const target = exploded ? separated : integrated

      ref.current.position.y = THREE.MathUtils.damp(
        ref.current.position.y,
        target,
        5,
        delta
      )
    })
  })

  const activeMaterial = (id: string, color: string) => (
    <meshStandardMaterial
      color={color}
      metalness={0.65}
      roughness={0.38}
      side={THREE.DoubleSide}
      emissive={selectedComponent === id ? color : '#000000'}
      emissiveIntensity={selectedComponent === id ? 0.2 : 0}
    />
  )

  const bladeAngles = [
    0,
    (Math.PI * 2) / 3,
    (Math.PI * 4) / 3,
  ]

  return (
    <group rotation={[0.08, -0.3, 0]}>

      {/* 01 — PÁS AERODINÂMICAS */}

      <group
        ref={bladesRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('blades')
        }}
      >
        {bladeAngles.map((angle, index) => (
          <group
            key={index}
            rotation={[0, angle, 0]}
          >
            <mesh
              geometry={bladeGeometry}
              castShadow
              receiveShadow
            >
              {activeMaterial('blades', '#c5b17f')}
            </mesh>
          </group>
        ))}

        <Callout
          position={[1.35, 1.9, 0.25]}
          number="01"
          label="PÁS AERODINÂMICAS"
          active={selectedComponent === 'blades'}
          onSelect={() => onSelect('blades')}
        />
      </group>

      {/* 02 — BRAÇOS DO ROTOR */}

      <group
        ref={armsRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('arms')
        }}
      >
        {bladeAngles.map((angle, index) => (
          <group
            key={index}
            rotation={[0, angle, 0]}
          >
            {[-1, 1].map((side) => (
              <group
                key={side}
                position={[0, side * 1.35, 0]}
              >
                <mesh
                  position={[0.66, 0, 0]}
                  rotation={[0, 0, Math.PI / 2]}
                  castShadow
                >
                  <cylinderGeometry args={[0.045, 0.045, 1.3, 16]} />
                  {activeMaterial('arms', '#858c80')}
                </mesh>

                <mesh
                  position={[1.2, 0, 0]}
                  castShadow
                >
                  <sphereGeometry args={[0.085, 16, 16]} />
                  {activeMaterial('arms', '#c2b58f')}
                </mesh>

                <mesh position={[0.08, 0, 0]}>
                  <sphereGeometry args={[0.09, 16, 16]} />
                  {activeMaterial('arms', '#858c80')}
                </mesh>
              </group>
            ))}
          </group>
        ))}

        <Callout
          position={[0.15, 2.15, 0.65]}
          number="02"
          label="BRAÇOS DO ROTOR"
          active={selectedComponent === 'arms'}
          onSelect={() => onSelect('arms')}
        />
      </group>

      {/* 03 — EIXO CENTRAL */}

      <group
        ref={shaftRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('shaft')
        }}
      >
        <mesh castShadow>
          <cylinderGeometry args={[0.105, 0.105, 3.85, 32]} />
          {activeMaterial('shaft', '#aeb5ad')}
        </mesh>

        <mesh position={[0, 1.85, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 32]} />
          {activeMaterial('shaft', '#d0d2c6')}
        </mesh>

        <mesh position={[0, -1.85, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 32]} />
          {activeMaterial('shaft', '#d0d2c6')}
        </mesh>

        <Callout
          position={[-0.25, 0.45, 0.3]}
          number="03"
          label="EIXO CENTRAL"
          active={selectedComponent === 'shaft'}
          onSelect={() => onSelect('shaft')}
        />
      </group>

      {/* 04 — MANCAIS */}

      <group
        ref={bearingsRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('bearings')
        }}
      >
        {[-1.72, 1.72].map((height) => (
          <group
            key={height}
            position={[0, height, 0]}
          >
            <mesh
              rotation={[Math.PI / 2, 0, 0]}
              castShadow
            >
              <torusGeometry args={[0.24, 0.085, 16, 40]} />
              {activeMaterial('bearings', '#a6aa9c')}
            </mesh>

            <mesh
              position={[0, -0.13, 0]}
              castShadow
            >
              <cylinderGeometry args={[0.3, 0.3, 0.12, 32]} />
              {activeMaterial('bearings', '#70786d')}
            </mesh>

            {[-1, 1].map((side) => (
              <mesh
                key={side}
                position={[side * 0.34, -0.13, 0]}
              >
                <boxGeometry args={[0.2, 0.12, 0.38]} />
                {activeMaterial('bearings', '#858c80')}
              </mesh>
            ))}
          </group>
        ))}

        <Callout
          position={[-0.55, 2.2, 0.45]}
          number="04"
          label="MANCAIS"
          active={selectedComponent === 'bearings'}
          onSelect={() => onSelect('bearings')}
        />
      </group>

      {/* 05 — GERADOR ELÉTRICO */}

      <group
        ref={generatorRef}
        onClick={(event) => {
          event.stopPropagation()
          onSelect('generator')
        }}
      >
        <mesh
          position={[0, -1.92, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.4, 0.4, 0.62, 40]} />
          {activeMaterial('generator', '#8b927e')}
        </mesh>

        <mesh
          position={[0, -2.25, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.34, 0.34, 0.09, 40]} />
          {activeMaterial('generator', '#626b5c')}
        </mesh>

        <mesh
          position={[0, -1.59, 0]}
          castShadow
        >
          <cylinderGeometry args={[0.32, 0.32, 0.09, 40]} />
          {activeMaterial('generator', '#a8ae9a')}
        </mesh>

        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index / 12) * Math.PI * 2

          return (
            <mesh
              key={index}
              position={[
                Math.cos(angle) * 0.36,
                -1.92,
                Math.sin(angle) * 0.36,
              ]}
            >
              <boxGeometry args={[0.055, 0.4, 0.055]} />
              <meshStandardMaterial
                color="#50584b"
                metalness={0.7}
                roughness={0.4}
              />
            </mesh>
          )
        })}

        <Callout
          position={[0.65, -1.9, 0.45]}
          number="05"
          label="GERADOR ELÉTRICO"
          active={selectedComponent === 'generator'}
          onSelect={() => onSelect('generator')}
        />
      </group>
    </group>
  )
}
