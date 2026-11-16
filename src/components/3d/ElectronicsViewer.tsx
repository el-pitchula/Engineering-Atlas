
import { useState, useEffect, Suspense } from 'react'
import type { CSSProperties } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars, Edges, Text } from '@react-three/drei'
import * as THREE from 'three'
import ElectronicsModel from './ElectronicsModel'

const COLORS = {
  background: '#101b19',
  surface: '#192824',
  surfaceLight: '#22362f',
  line: '#34483e',
  green: '#75c69a',
  greenLight: '#b4d98b',
  copper: '#c58c4a',
  text: '#edf3ee',
  muted: '#9aafa5',
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
  pcb: {
    number: '01',
    title: 'Placa de circuito impresso',
    category: 'ESTRUTURA ELETRÔNICA',
    description:
      'A placa de circuito impresso (PCB) fornece a base física para a montagem dos componentes eletrônicos e estabelece as conexões elétricas entre eles por meio de trilhas condutoras.',
    details: [
      'Sustenta mecanicamente os componentes.',
      'Possui trilhas condutoras que interligam os circuitos.',
      'Organiza as conexões elétricas e a distribuição de sinais.',
    ],
  },
  microcontroller: {
    number: '02',
    title: 'Microcontrolador',
    category: 'UNIDADE DE PROCESSAMENTO',
    description:
      'O microcontrolador é um circuito integrado programável que executa instruções, processa informações e controla as operações do sistema eletrônico.',
    details: [
      'Executa instruções armazenadas em sua memória.',
      'Processa sinais provenientes de sensores.',
      'Controla periféricos e dispositivos conectados.',
    ],
  },
  regulator: {
    number: '03',
    title: 'Regulador de tensão',
    category: 'SUBSISTEMA DE ALIMENTAÇÃO',
    description:
      'O regulador de tensão mantém a alimentação elétrica dentro de níveis adequados para o funcionamento dos circuitos e componentes da placa.',
    details: [
      'Estabiliza a tensão de alimentação.',
      'Fornece níveis elétricos adequados aos circuitos.',
      'Contribui para a proteção dos componentes sensíveis.',
    ],
  },
  connectors: {
    number: '04',
    title: 'Conectores',
    category: 'INTERFACES ELÉTRICAS',
    description:
      'Os conectores estabelecem interfaces físicas e elétricas entre a placa e os dispositivos externos, permitindo alimentação, comunicação e expansão do sistema.',
    details: [
      'Permitem a conexão com dispositivos externos.',
      'Disponibilizam interfaces de alimentação e comunicação.',
      'Facilitam a integração e manutenção do sistema.',
    ],
  },
  sensors: {
    number: '05',
    title: 'Sensores',
    category: 'AQUISIÇÃO DE DADOS',
    description:
      'Os sensores detectam grandezas físicas do ambiente e convertem essas informações em sinais que podem ser interpretados pelo sistema eletrônico.',
    details: [
      'Realizam a aquisição de grandezas físicas.',
      'Convertem fenômenos físicos em sinais elétricos.',
      'Fornecem informações para processamento e controle.',
    ],
  },
  passives: {
    number: '06',
    title: 'Componentes passivos',
    category: 'CONDICIONAMENTO DE SINAIS',
    description:
      'Resistores e capacitores são componentes fundamentais para o condicionamento de sinais, controle de corrente, filtragem e estabilização dos circuitos.',
    details: [
      'Resistores limitam corrente e estabelecem divisões de tensão.',
      'Capacitores armazenam temporariamente energia elétrica.',
      'Podem atuar em filtros e circuitos de estabilização.',
    ],
  },
}

const componentGroups = [
  {
    name: 'Estrutura',
    items: [
      { id: 'pcb', name: 'Placa de circuito impresso', number: '01' },
    ],
  },
  {
    name: 'Processamento',
    items: [
      { id: 'microcontroller', name: 'Microcontrolador', number: '02' },
    ],
  },
  {
    name: 'Alimentação',
    items: [
      { id: 'regulator', name: 'Regulador de tensão', number: '03' },
    ],
  },
  {
    name: 'Interfaces',
    items: [
      { id: 'connectors', name: 'Conectores', number: '04' },
    ],
  },
  {
    name: 'Aquisição e condicionamento',
    items: [
      { id: 'sensors', name: 'Sensores', number: '05' },
      { id: 'passives', name: 'Componentes passivos', number: '06' },
    ],
  },
]

const buttonStyle = (active: boolean): CSSProperties => ({
  padding: '10px 15px',
  border: `1px solid ${active ? COLORS.green : COLORS.line}`,
  borderRadius: '3px',
  background: active ? COLORS.green : 'transparent',
  color: active ? '#10251c' : COLORS.muted,
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
  width = 3.4,
  height = 2.55,
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
          color={texture ? '#ffffff' : '#192824'}
          transparent={!texture}
          opacity={texture ? 1 : 0.22}
          side={THREE.DoubleSide}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={1}
        />

        <Edges
          color="#527963"
          threshold={15}
          lineWidth={1}
        />
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
            color="#75c69a"
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
            color="#b1c7b9"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={width - 0.3}
          >
            {subtitle}
          </Text>

          <mesh position={[0, -0.42, 0]}>
            <planeGeometry args={[1.65, 0.008]} />
            <meshBasicMaterial color="#34483e" />
          </mesh>

          <Text
            position={[0, -0.58, 0]}
            fontSize={0.085}
            color="#82998b"
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

function ElectronicsTechnicalReferences() {
  return (
    <group>
      {/* 01 — VISTA FRONTAL */}

      <ReferencePlane
        title="01 / FRONT VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA FRONTAL"
        imagePath="/projects/electronics/front-view.png"
        position={[0, 0, -3.6]}
        rotation={[0, 0, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 02 — VISTA LATERAL */}

      <ReferencePlane
        title="02 / SIDE VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA LATERAL"
        imagePath="/projects/electronics/side-view.png"
        position={[-4.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 03 — VISTA SUPERIOR */}

      <ReferencePlane
        title="03 / TOP VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA SUPERIOR"
        imagePath="/projects/electronics/top-view.png"
        position={[0, -1.65, 0]}
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

export default function ElectronicsViewer() {
  const [selectedComponent, setSelectedComponent] = useState('pcb')
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
              color: COLORS.green,
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
            EMBEDDED CONTROL SYSTEM / INSPEÇÃO DIGITAL
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
                color: COLORS.green,
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
                color: '#82998b',
                fontFamily: 'DM Mono, monospace',
                fontSize: '9px',
              }}
            >
              ELECTRONIC SYSTEM / 004
            </div>
          </div>

          {/* INDICADOR DE ORIENTAÇÃO */}

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              right: '18px',
              top: '17px',
              color: '#82998b',
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              textAlign: 'right',
              pointerEvents: 'none',
              lineHeight: 1.8,
            }}
          >
            <div>3D VIEW</div>
            <div>EMBEDDED ELECTRONICS</div>
          </div>

          <Canvas
            camera={{
              position: [5.8, 4.2, 7.8],
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

            <fog attach="fog" args={[COLORS.background, 13, 28]} />

            {/* ILUMINAÇÃO */}

            <ambientLight intensity={0.65} />

            <hemisphereLight
              args={['#d9f0df', '#14251e', 1.15]}
            />

            <directionalLight
              position={[5, 8, 6]}
              intensity={2.6}
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
              position={[-5, 1, -4]}
              intensity={1.6}
              color="#75c69a"
              distance={15}
            />

            <pointLight
              position={[3, -2, 5]}
              intensity={1.1}
              color="#c58c4a"
              distance={12}
            />

            <spotLight
              position={[0, 7, 2]}
              intensity={1.3}
              color="#ffffff"
              angle={0.65}
              penumbra={0.8}
              distance={15}
            />

            {/* GRADE DE REFERÊNCIA */}

            <gridHelper
              args={[12, 24, '#365747', '#20382e']}
              position={[0, -1.8, 0]}
            />

            <Suspense fallback={null}>
              <ElectronicsModel
                onSelect={selectComponent}
                selectedComponent={selectedComponent}
                exploded={exploded}
              />

              <ElectronicsTechnicalReferences />

              <Stars
                radius={70}
                depth={45}
                count={850}
                factor={2}
                saturation={0}
                fade
                speed={0.15}
              />
            </Suspense>

            {/* CONTROLES DE ÓRBITA */}

            <OrbitControls
              makeDefault
              target={[0, 0, 0]}
              enablePan
              enableZoom
              enableRotate
              enableDamping
              dampingFactor={0.07}
              minDistance={4}
              maxDistance={15}
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
              color: '#82998b',
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
              color: COLORS.green,
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              pointerEvents: 'none',
            }}
          >
            {exploded ? 'EXPLODED CONFIGURATION' : 'ASSEMBLED CONFIGURATION'}
          </div>
        </div>

        {/* NAVEGADOR HIERÁRQUICO */}

        <aside
          style={{
            padding: '20px 15px',
            background: COLORS.surface,
            borderTop: `2px solid ${COLORS.green}`,
            borderBottom: `1px solid ${COLORS.line}`,
          }}
        >
          <span
            style={{
              color: COLORS.green,
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
            }}
          >
            ESTRUTURA DO SISTEMA
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
                  color: '#82998b',
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
                        active ? COLORS.green : 'transparent'
                      }`,
                      background: active ? '#294337' : 'transparent',
                      color: active ? COLORS.text : '#b4c5bb',
                      textAlign: 'left',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        color: active ? COLORS.greenLight : COLORS.copper,
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                      }}
                    >
                      {item.number}
                    </span>

                    <span style={{ flex: 1 }}>{item.name}</span>

                    {active && (
                      <span style={{ color: COLORS.green, fontSize: '9px' }}>
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
              ? 'Todos os conjuntos estão disponíveis para exploração.'
              : 'Selecione um componente no modelo ou na lista para inspecioná-lo.'}
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
          <span style={{ color: COLORS.green }}>● PCB</span>
          <span style={{ color: '#b4d98b' }}>● MICROCONTROLADOR</span>
          <span style={{ color: COLORS.copper }}>● REGULADOR</span>
          <span style={{ color: '#b9c6c0' }}>● CONECTORES</span>
          <span style={{ color: '#75b69a' }}>● SENSORES</span>
          <span style={{ color: '#d1aa73' }}>● PASSIVOS</span>
        </div>
      )}

      {/* PAINEL DE INFORMAÇÕES */}

      <section
        style={{
          position: 'relative',
          marginTop: '22px',
          padding: '26px 28px',
          background: COLORS.surface,
          borderLeft: `3px solid ${COLORS.green}`,
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <span
          style={{
            color: COLORS.green,
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
            color: '#c1d2c8',
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
            color: '#82998b',
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
