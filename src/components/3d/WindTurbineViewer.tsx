
import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Edges } from '@react-three/drei'
import * as THREE from 'three'
import WindTurbineModel from './WindTurbineModel'

const COLORS = {
  background: '#191a16',
  surface: '#25271f',
  line: '#424536',
  accent: '#e5bd70',
  highlight: '#a5bd78',
  text: '#f2f0e8',
  muted: '#aaa99c',
}

const componentInfo: Record<
  string,
  {
    number: string
    title: string
    category: string
    description: string
    details: string[]
  }
> = {
  blades: {
    number: '01',
    title: 'Pás aerodinâmicas',
    category: 'CAPTAÇÃO DE ENERGIA EÓLICA',
    description:
      'As pás são os elementos responsáveis por interagir com o fluxo de ar. Seu perfil aerodinâmico permite converter parte da energia cinética do vento em movimento rotacional do rotor.',
    details: [
      'São distribuídas ao redor do eixo central.',
      'Seu perfil influencia o desempenho aerodinâmico.',
      'Convertem a ação do vento em movimento mecânico.',
    ],
  },
  arms: {
    number: '02',
    title: 'Braços do rotor',
    category: 'TRANSMISSÃO MECÂNICA',
    description:
      'Os braços conectam as pás ao eixo central e transmitem os esforços mecânicos produzidos durante a rotação. Também contribuem para manter a geometria e o posicionamento do conjunto.',
    details: [
      'Conectam as pás ao eixo central.',
      'Transmitem os esforços mecânicos do rotor.',
      'Precisam suportar esforços de flexão e fadiga.',
    ],
  },
  shaft: {
    number: '03',
    title: 'Eixo central',
    category: 'TRANSMISSÃO DE TORQUE',
    description:
      'O eixo central recebe o movimento rotacional do rotor e transmite o torque ao sistema de conversão eletromecânica. É um dos principais elementos de transmissão de potência da turbina.',
    details: [
      'Conecta mecanicamente o rotor ao gerador.',
      'Transmite torque durante a operação.',
      'Trabalha sob esforços combinados de torção e flexão.',
    ],
  },
  bearings: {
    number: '04',
    title: 'Mancais',
    category: 'APOIO E ROTAÇÃO',
    description:
      'Os mancais sustentam e orientam o eixo rotativo. Seus rolamentos permitem a rotação com menor atrito e ajudam a manter o alinhamento do conjunto mecânico.',
    details: [
      'Sustentam e posicionam o eixo central.',
      'Reduzem o atrito durante a rotação.',
      'Auxiliam na estabilidade do conjunto rotativo.',
    ],
  },
  generator: {
    number: '05',
    title: 'Gerador elétrico',
    category: 'CONVERSÃO ELETROMECÂNICA',
    description:
      'O gerador converte a energia mecânica de rotação recebida do eixo em energia elétrica por indução eletromagnética. Sua operação depende da velocidade de rotação e das características construtivas do equipamento.',
    details: [
      'Recebe energia mecânica do eixo.',
      'Converte movimento rotacional em energia elétrica.',
      'Pode ser associado a circuitos de condicionamento de energia.',
    ],
  },
}

const componentGroups = [
  {
    name: 'Conjunto aerodinâmico',
    items: [
      { id: 'blades', name: 'Pás aerodinâmicas', number: '01' },
      { id: 'arms', name: 'Braços do rotor', number: '02' },
    ],
  },
  {
    name: 'Transmissão mecânica',
    items: [
      { id: 'shaft', name: 'Eixo central', number: '03' },
      { id: 'bearings', name: 'Mancais', number: '04' },
    ],
  },
  {
    name: 'Conversão eletromecânica',
    items: [
      { id: 'generator', name: 'Gerador elétrico', number: '05' },
    ],
  },
]

const buttonStyle = (active: boolean): React.CSSProperties => ({
  padding: '10px 15px',
  border: `1px solid ${active ? COLORS.accent : COLORS.line}`,
  borderRadius: '3px',
  background: active ? COLORS.accent : 'transparent',
  color: active ? '#25271f' : COLORS.muted,
  cursor: 'pointer',
  fontFamily: 'DM Mono, monospace',
  fontSize: '10px',
  letterSpacing: '0.04em',
  transition: 'all 0.2s ease',
})

// =====================================================
// REFERÊNCIAS TÉCNICAS
// =====================================================

interface ReferencePlaneProps {
  title: string
  subtitle: string
  imagePath: string
  position: [number, number, number]
  rotation: [number, number, number]
  width?: number
  height?: number
}

function ReferencePlane({
  title,
  subtitle,
  imagePath,
  position,
  rotation,
  width = 4.5,
  height = 3.0,
}: ReferencePlaneProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)

  useEffect(() => {
    let active = true
    let loadedTexture: THREE.Texture | null = null

    const loader = new THREE.TextureLoader()

    loader.load(
      imagePath,
      (loaded) => {
        if (!active) {
          loaded.dispose()
          return
        }

        loaded.colorSpace = THREE.SRGBColorSpace
        loaded.anisotropy = 8

        loadedTexture = loaded
        setTexture(loaded)
      },
      undefined,
      () => {
        if (active) {
          setTexture(null)
        }
      },
    )

    return () => {
      active = false
      loadedTexture?.dispose()
    }
  }, [imagePath])

  return (
    <group position={position} rotation={rotation}>
      {/* SUPERFÍCIE DO PLANO */}

      <mesh>
        <planeGeometry args={[width, height]} />

        <meshBasicMaterial
          color={texture ? '#ffffff' : '#25271f'}
          transparent={!texture}
          opacity={texture ? 1 : 0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={1}
        />

        <Edges color="#777765" threshold={15} lineWidth={1} />
      </mesh>

      {/* DESENHO TÉCNICO */}

      {texture && (
        <mesh position={[0, 0, 0.012]}>
          <planeGeometry args={[width, height]} />

          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            toneMapped={false}
            transparent={false}
          />
        </mesh>
      )}

      {/* IDENTIFICAÇÃO DO PLANO */}

      {!texture && (
        <group position={[0, 0, 0.025]}>
          <Text
            position={[0, 0.32, 0]}
            fontSize={0.19}
            color="#e5bd70"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={width - 0.3}
            letterSpacing={0.06}
          >
            {title}
          </Text>

          <Text
            position={[0, -0.05, 0]}
            fontSize={0.105}
            color="#d0d0c5"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={width - 0.3}
          >
            {subtitle}
          </Text>

          <mesh position={[0, -0.42, 0]}>
            <planeGeometry args={[1.65, 0.008]} />
            <meshBasicMaterial color="#626653" />
          </mesh>

          <Text
            position={[0, -0.58, 0]}
            fontSize={0.085}
            color="#aaa99c"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={width - 0.3}
          >
            AGUARDANDO ARQUIVO PNG
          </Text>
        </group>
      )}
    </group>
  )
}

function WindTurbineTechnicalReferences() {
  return (
    <group>
      {/* 01 — VISTA FRONTAL */}

      <ReferencePlane
        title="01 / FRONT VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA FRONTAL"
        imagePath="/projects/energy/front-view.png"
        position={[0, 0, -3.8]}
        rotation={[0, 0, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 02 — VISTA LATERAL */}

      <ReferencePlane
        title="02 / SIDE VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA LATERAL"
        imagePath="/projects/energy/side-view.png"
        position={[-4.7, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 03 — VISTA SUPERIOR */}

      <ReferencePlane
        title="03 / TOP VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA SUPERIOR"
        imagePath="/projects/energy/top-view.png"
        position={[0, -2.45, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={4.5}
        height={3.0}
      />
    </group>
  )
}

// =====================================================
// VISUALIZADOR PRINCIPAL
// =====================================================

export default function WindTurbineViewer() {
  const [selectedComponent, setSelectedComponent] = useState('blades')
  const [exploded, setExploded] = useState(false)

  const selectedInfo = componentInfo[selectedComponent]

  const selectComponent = (id: string) => {
    setSelectedComponent(id)
  }

  return (
    <div style={{ color: COLORS.text }}>
      {/* CONTROLES DE VISUALIZAÇÃO */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          marginBottom: '16px',
        }}
      >
        <div>
          <span
            style={{
              color: COLORS.accent,
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.1em',
            }}
          >
            MODO DE VISUALIZAÇÃO
          </span>

          <div
            style={{
              marginTop: '5px',
              color: COLORS.muted,
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
            }}
          >
            WIND TURBINE / INSPEÇÃO DIGITAL
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setExploded(false)}
            style={buttonStyle(!exploded)}
          >
            VISTA INTEGRADA
          </button>

          <button
            onClick={() => setExploded(true)}
            style={buttonStyle(exploded)}
          >
            VISTA EXPLODIDA
          </button>
        </div>
      </div>

      {/* MODELO E NAVEGADOR */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(210px, 250px)',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        {/* VISUALIZADOR 3D */}

        <div
          style={{
            position: 'relative',
            minWidth: 0,
            height: '540px',
            background: COLORS.background,
            border: `1px solid ${COLORS.line}`,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          {/* IDENTIFICAÇÃO DA CENA */}

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              top: '17px',
              left: '18px',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                color: COLORS.accent,
                fontFamily: 'DM Mono, monospace',
                fontSize: '9px',
                letterSpacing: '0.1em',
              }}
            >
              ENGINEERING ATLAS
            </div>

            <div
              style={{
                marginTop: '5px',
                color: COLORS.muted,
                fontFamily: 'DM Mono, monospace',
                fontSize: '9px',
              }}
            >
              WIND TURBINE / 003
            </div>
          </div>

          {/* INDICADOR DE ORIENTAÇÃO */}

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              right: '18px',
              top: '17px',
              color: COLORS.muted,
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              textAlign: 'right',
              pointerEvents: 'none',
              lineHeight: 1.8,
            }}
          >
            <div>3D VIEW</div>
            <div>ENERGY CONVERSION SYSTEM</div>
          </div>

          <Canvas
            camera={{
              position: [6, 4.5, 8],
              fov: 38,
              near: 0.1,
              far: 100,
            }}
            shadows
            dpr={[1, 2]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
            }}
          >
            {/* AMBIENTE */}

            <color attach="background" args={[COLORS.background]} />

            <fog attach="fog" args={[COLORS.background, 15, 32]} />

            {/* ILUMINAÇÃO */}

            <ambientLight intensity={0.85} />

            <hemisphereLight
              args={['#f0eee2', '#33372b', 1.1]}
            />

            <directionalLight
              position={[5, 8, 6]}
              intensity={2.4}
              color="#ffffff"
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-7}
              shadow-camera-right={7}
              shadow-camera-top={7}
              shadow-camera-bottom={-7}
              shadow-bias={-0.0001}
            />

            <pointLight
              position={[-5, 2, -4]}
              intensity={1.3}
              color="#d6c69a"
              distance={16}
            />

            <pointLight
              position={[3, -1, 5]}
              intensity={1.1}
              color="#a5bd78"
              distance={12}
            />

            <spotLight
              position={[0, 7, 2]}
              intensity={1.2}
              color="#ffffff"
              angle={0.65}
              penumbra={0.8}
              distance={16}
            />

            {/* GRADE DE REFERÊNCIA */}

            <gridHelper
              args={[14, 28, '#626653', '#33372b']}
              position={[0, -2.6, 0]}
            />

            <Suspense fallback={null}>
              <WindTurbineModel
                onSelect={selectComponent}
                selectedComponent={selectedComponent}
                exploded={exploded}
              />

              <WindTurbineTechnicalReferences />
            </Suspense>

            {/* CONTROLES DE ÓRBITA */}

            <OrbitControls
              makeDefault
              target={[0, -0.1, 0]}
              enablePan
              enableZoom
              enableRotate
              enableDamping
              dampingFactor={0.07}
              minDistance={3}
              maxDistance={18}
              minPolarAngle={0.15}
              maxPolarAngle={Math.PI - 0.15}
              rotateSpeed={0.75}
              zoomSpeed={0.8}
            />
          </Canvas>

          {/* RODAPÉ DA CENA */}

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              bottom: '14px',
              left: '18px',
              color: COLORS.muted,
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              pointerEvents: 'none',
            }}
          >
            ROTATE / ZOOM / INSPECT
          </div>

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              bottom: '14px',
              right: '18px',
              color: COLORS.accent,
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              pointerEvents: 'none',
            }}
          >
            {exploded ? 'EXPLODED CONFIGURATION' : 'ASSEMBLED CONFIGURATION'}
          </div>
        </div>

        {/* NAVEGADOR DE COMPONENTES */}

        <aside
          style={{
            padding: '20px 15px',
            background: COLORS.surface,
            borderTop: `2px solid ${COLORS.accent}`,
            borderBottom: `1px solid ${COLORS.line}`,
          }}
        >
          <span
            style={{
              color: COLORS.accent,
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
            }}
          >
            ARQUITETURA ENERGÉTICA
          </span>

          <h3
            style={{
              margin: '10px 0 20px',
              color: COLORS.text,
              fontSize: '17px',
              fontWeight: 600,
            }}
          >
            Componentes
          </h3>

          {componentGroups.map((group) => (
            <div key={group.name} style={{ marginBottom: '20px' }}>
              <div
                style={{
                  marginBottom: '8px',
                  color: COLORS.muted,
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '9px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {group.name}
              </div>

              {group.items.map((item) => {
                const active = selectedComponent === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => selectComponent(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '9px',
                      width: '100%',
                      padding: '10px 8px',
                      marginBottom: '3px',
                      border: 'none',
                      borderLeft: `2px solid ${
                        active ? COLORS.accent : 'transparent'
                      }`,
                      background: active ? '#393426' : 'transparent',
                      color: active ? COLORS.text : '#c5c4b9',
                      textAlign: 'left',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        color: COLORS.accent,
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                      }}
                    >
                      {item.number}
                    </span>

                    <span style={{ flex: 1 }}>{item.name}</span>

                    {active && (
                      <span style={{ color: COLORS.accent, fontSize: '9px' }}>
                        ●
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          <div
            style={{
              marginTop: '22px',
              paddingTop: '14px',
              borderTop: `1px solid ${COLORS.line}`,
              color: COLORS.muted,
              fontSize: '10px',
              lineHeight: 1.7,
            }}
          >
            {exploded
              ? 'Os componentes estão separados para facilitar a análise de sua disposição.'
              : 'Ative a vista explodida para observar a organização dos componentes.'}
          </div>
        </aside>
      </div>

      {/* LEGENDA DA VISTA EXPLODIDA */}

      {exploded && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '18px',
            marginTop: '14px',
            padding: '12px 0',
            borderBottom: `1px solid ${COLORS.line}`,
            color: COLORS.muted,
            fontFamily: 'DM Mono, monospace',
            fontSize: '9px',
          }}
        >
          <span style={{ color: '#c5b17f' }}>● PÁS</span>
          <span style={{ color: '#858c80' }}>● BRAÇOS</span>
          <span style={{ color: '#aeb5ad' }}>● EIXO</span>
          <span style={{ color: '#a6aa9c' }}>● MANCAIS</span>
          <span style={{ color: '#8b927e' }}>● GERADOR</span>
        </div>
      )}

      {/* PAINEL DE INFORMAÇÕES */}

      <section
        style={{
          position: 'relative',
          marginTop: '22px',
          padding: '26px 28px',
          background: COLORS.surface,
          borderLeft: `3px solid ${COLORS.accent}`,
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <span
          style={{
            color: COLORS.accent,
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
          }}
        >
          COMPONENTE {selectedInfo.number} / {selectedInfo.category}
        </span>

        <h3
          style={{
            margin: '13px 0',
            fontSize: '24px',
            fontWeight: 600,
            color: COLORS.text,
            letterSpacing: '-0.03em',
          }}
        >
          {selectedInfo.title}
        </h3>

        <p
          style={{
            maxWidth: '800px',
            color: COLORS.muted,
            fontSize: '14px',
            lineHeight: 1.85,
          }}
        >
          {selectedInfo.description}
        </p>

        <ul
          style={{
            paddingLeft: '20px',
            color: '#c9c8bd',
            fontSize: '13px',
            lineHeight: 2,
          }}
        >
          {selectedInfo.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>

        <span
          style={{
            display: 'block',
            marginTop: '22px',
            paddingTop: '13px',
            borderTop: `1px solid ${COLORS.line}`,
            color: COLORS.muted,
            fontFamily: 'DM Mono, monospace',
            fontSize: '9px',
            letterSpacing: '0.04em',
          }}
        >
          SELECIONE UM COMPONENTE NO MODELO OU NA LISTA PARA EXPLORÁ-LO
        </span>
      </section>
    </div>
  )
}
