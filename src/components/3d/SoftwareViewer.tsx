
import { useState, useEffect, Suspense } from 'react'
import type { CSSProperties } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  OrbitControls,
  Stars,
  Edges,
  Text,
} from '@react-three/drei'
import * as THREE from 'three'
import SoftwareModel from './SoftwareModel'

const COLORS = {
  background: '#111624',
  surface: '#1b2335',
  surfaceLight: '#26334b',
  line: '#343e56',
  blue: '#8ba9ed',
  violet: '#c4a5ef',
  text: '#eef0f8',
  muted: '#a0a9c0',
}

interface ComponentInfo {
  name: string
  category: string
  description: string
  function: string
  details: string[]
}

const componentInfo: Record<string, ComponentInfo> = {
  enclosure: {
    name: 'Gabinete estrutural',
    category: 'ESTRUTURA FÍSICA',
    description:
      'Estrutura responsável por proteger os elementos internos da unidade computacional e organizar sua montagem.',
    function:
      'Oferece proteção mecânica, sustentação e condições adequadas para a instalação dos componentes eletrônicos.',
    details: [
      'Proteção dos circuitos internos',
      'Fixação dos módulos',
      'Dissipação térmica e ventilação',
    ],
  },

  mainboard: {
    name: 'Placa principal',
    category: 'INFRAESTRUTURA ELETRÔNICA',
    description:
      'Plataforma que interconecta os principais componentes da unidade computacional.',
    function:
      'Estabelece as conexões elétricas e os canais de comunicação entre processamento, memória, armazenamento e interfaces.',
    details: [
      'Barramentos de comunicação',
      'Circuitos de alimentação',
      'Interfaces de expansão',
    ],
  },

  processor: {
    name: 'Módulo de processamento',
    category: 'PROCESSAMENTO',
    description:
      'Unidade responsável pela execução das instruções e pelo processamento das operações do sistema.',
    function:
      'Executa instruções, realiza operações lógicas e aritméticas e coordena o funcionamento dos demais recursos computacionais.',
    details: [
      'Execução de instruções',
      'Processamento de dados',
      'Gerenciamento de operações',
    ],
  },

  memory: {
    name: 'Memória e armazenamento',
    category: 'ARMAZENAMENTO DE DADOS',
    description:
      'Conjunto de recursos utilizados para armazenar temporariamente informações e preservar dados do sistema.',
    function:
      'Mantém dados e instruções disponíveis para processamento e permite o armazenamento persistente de informações.',
    details: [
      'Memória de acesso aleatório (RAM)',
      'Armazenamento em estado sólido (SSD)',
      'Transferência de dados',
    ],
  },
}

const componentGroups = [
  {
    title: 'ESTRUTURA',
    items: [
      { id: 'enclosure', number: '01', label: 'Gabinete estrutural' },
    ],
  },
  {
    title: 'INFRAESTRUTURA',
    items: [
      { id: 'mainboard', number: '02', label: 'Placa principal' },
    ],
  },
  {
    title: 'COMPUTAÇÃO',
    items: [
      { id: 'processor', number: '03', label: 'Processamento' },
      { id: 'memory', number: '04', label: 'Memória e armazenamento' },
    ],
  },
]

function ReferencePlane({
  title,
  subtitle,
  imagePath,
  position,
  rotation,
  width = 4.5,
  height = 3.0,
}: {
  title: string
  subtitle: string
  imagePath: string
  position: [number, number, number]
  rotation: [number, number, number]
  width?: number
  height?: number
}) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true

    const loader = new THREE.TextureLoader()

    loader.load(
      imagePath,
      (loadedTexture) => {
        if (!active) {
          loadedTexture.dispose()
          return
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace
        loadedTexture.anisotropy = 8

        setTexture(loadedTexture)
        setFailed(false)
      },
      undefined,
      () => {
        if (active) {
          setFailed(true)
        }
      },
    )

    return () => {
      active = false
      setTexture((currentTexture) => {
        currentTexture?.dispose()
        return null
      })
    }
  }, [imagePath])

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />

        {texture ? (
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent
          />
        ) : (
          <meshBasicMaterial
            color={COLORS.surface}
            side={THREE.DoubleSide}
          />
        )}

        <Edges color={COLORS.blue} />
      </mesh>

      {!texture && (
        <group>
          <Text
            position={[0, 0.25, 0.015]}
            fontSize={0.15}
            color={COLORS.blue}
            anchorX="center"
            anchorY="middle"
          >
            {title}
          </Text>

          <Text
            position={[0, -0.05, 0.015]}
            fontSize={0.105}
            color={COLORS.text}
            anchorX="center"
            anchorY="middle"
          >
            {failed ? 'DESENHO TÉCNICO NÃO DISPONÍVEL' : 'CARREGANDO REFERÊNCIA'}
          </Text>

          <Text
            position={[0, -0.35, 0.015]}
            fontSize={0.09}
            color={COLORS.muted}
            anchorX="center"
            anchorY="middle"
          >
            {subtitle}
          </Text>

          <Text
            position={[0, -0.85, 0.015]}
            fontSize={0.075}
            color={COLORS.muted}
            anchorX="center"
            anchorY="middle"
          >
            ENGINEERING ATLAS / SOFTWARE
          </Text>
        </group>
      )}
    </group>
  )
}

function SoftwareTechnicalReferences() {
  return (
    <group>
      {/* 01 — VISTA FRONTAL */}

      <ReferencePlane
        title="01 / FRONT VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA FRONTAL"
        imagePath="/projects/software/front-view.png"
        position={[0, 0, -4.0]}
        rotation={[0, 0, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 02 — VISTA LATERAL */}

      <ReferencePlane
        title="02 / SIDE VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA LATERAL"
        imagePath="/projects/software/side-view.png"
        position={[-4.8, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 03 — VISTA SUPERIOR */}

      <ReferencePlane
        title="03 / TOP VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA SUPERIOR"
        imagePath="/projects/software/top-view.png"
        position={[0, -1.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={4.5}
        height={3.0}
      />
    </group>
  )
}

const panelStyle: CSSProperties = {
  background: 'rgba(17, 22, 36, 0.96)',
  border: `1px solid ${COLORS.line}`,
  color: COLORS.text,
  fontFamily: 'DM Sans, sans-serif',
}

const monoStyle: CSSProperties = {
  fontFamily: 'DM Mono, monospace',
  letterSpacing: '0.08em',
}

export default function SoftwareViewer() {
  const [selectedComponent, setSelectedComponent] = useState('enclosure')
  const [exploded, setExploded] = useState(false)

  const selectedInfo = componentInfo[selectedComponent]

  return (
    <section
      style={{
        width: '100%',
        color: COLORS.text,
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* CABEÇALHO DO VISUALIZADOR */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          padding: '14px 0',
          borderTop: `1px solid ${COLORS.line}`,
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <div>
          <div
            style={{
              ...monoStyle,
              color: COLORS.blue,
              fontSize: '10px',
            }}
          >
            INTERACTIVE MODEL / SW-001
          </div>

          <div
            style={{
              fontSize: '13px',
              marginTop: '5px',
              color: COLORS.muted,
            }}
          >
            Unidade de computação embarcada
          </div>
        </div>

        <button
          onClick={() => setExploded((current) => !current)}
          style={{
            padding: '10px 16px',
            background: exploded ? COLORS.blue : COLORS.surface,
            color: exploded ? COLORS.background : COLORS.text,
            border: `1px solid ${COLORS.blue}`,
            borderRadius: '2px',
            cursor: 'pointer',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.06em',
          }}
        >
          {exploded ? 'RECOMPOR MODELO' : 'EXPLODIR COMPONENTES'}
        </button>
      </div>

      {/* ÁREA 3D */}

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '620px',
          background: COLORS.background,
          borderBottom: `1px solid ${COLORS.line}`,
          overflow: 'hidden',
        }}
      >
        <Canvas
          camera={{
            position: [7.0, 5.4, 8.8],
            fov: 38,
            near: 0.1,
            far: 100,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
          }}
        >
          <color attach="background" args={[COLORS.background]} />

          <fog
            attach="fog"
            args={[COLORS.background, 15, 32]}
          />

          <Suspense fallback={null}>
            <Stars
              radius={45}
              depth={35}
              count={700}
              factor={2}
              saturation={0.2}
              fade
              speed={0.35}
            />

            <ambientLight intensity={0.75} />

            <directionalLight
              position={[5, 8, 6]}
              intensity={2.0}
              color="#dce5ff"
            />

            <directionalLight
              position={[-5, 3, -4]}
              intensity={1.0}
              color="#8ba9ed"
            />

            <pointLight
              position={[0, 4, 3]}
              intensity={0.7}
              color="#c4a5ef"
            />

            <SoftwareModel
              onSelect={setSelectedComponent}
              selectedComponent={selectedComponent}
              exploded={exploded}
            />

            <SoftwareTechnicalReferences />

            <gridHelper
              args={[12, 24, '#34466b', '#202d48']}
              position={[0, -1.65, 0]}
            />
          </Suspense>

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.06}
            minDistance={5}
            maxDistance={19}
            maxPolarAngle={Math.PI / 2.02}
            target={[0, 0.1, 0]}
          />
        </Canvas>

        {/* IDENTIFICAÇÃO */}

        <div
          style={{
            position: 'absolute',
            top: '18px',
            left: '18px',
            pointerEvents: 'none',
            ...monoStyle,
            fontSize: '9px',
            color: COLORS.muted,
            lineHeight: 1.8,
          }}
        >
          <div style={{ color: COLORS.blue }}>
            FIG. 01 — EMBEDDED COMPUTING UNIT
          </div>
          <div>3D ASSEMBLY / INTERACTIVE VIEW</div>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '18px',
            top: '18px',
            ...monoStyle,
            fontSize: '9px',
            color: COLORS.muted,
            textAlign: 'right',
            pointerEvents: 'none',
            lineHeight: 1.8,
          }}
        >
          <div>ROTATE / DRAG</div>
          <div>ZOOM / SCROLL</div>
        </div>

        {/* LEGENDA DE SELEÇÃO */}

        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            ...monoStyle,
            fontSize: '9px',
            color: COLORS.muted,
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              background: COLORS.blue,
              display: 'inline-block',
            }}
          />
          COMPONENTE SELECIONADO
        </div>
      </div>

      {/* PAINÉIS INFORMATIVOS */}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.35fr)',
          gap: '1px',
          background: COLORS.line,
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        {/* HIERARQUIA */}

        <div
          style={{
            ...panelStyle,
            padding: '22px',
          }}
        >
          <div
            style={{
              ...monoStyle,
              color: COLORS.blue,
              fontSize: '10px',
              marginBottom: '20px',
            }}
          >
            01 / COMPONENT HIERARCHY
          </div>

          {componentGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: '19px' }}>
              <div
                style={{
                  ...monoStyle,
                  color: COLORS.muted,
                  fontSize: '9px',
                  marginBottom: '8px',
                }}
              >
                {group.title}
              </div>

              {group.items.map((item) => {
                const active = selectedComponent === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => setSelectedComponent(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      gap: '10px',
                      padding: '9px 8px',
                      marginBottom: '3px',
                      textAlign: 'left',
                      background: active
                        ? 'rgba(139, 169, 237, 0.13)'
                        : 'transparent',
                      border: 'none',
                      borderLeft: active
                        ? `2px solid ${COLORS.blue}`
                        : '2px solid transparent',
                      color: active ? COLORS.text : COLORS.muted,
                      cursor: 'pointer',
                      fontFamily: 'DM Sans, sans-serif',
                      fontSize: '12px',
                    }}
                  >
                    <span
                      style={{
                        ...monoStyle,
                        color: COLORS.blue,
                        fontSize: '10px',
                      }}
                    >
                      {item.number}
                    </span>

                    <span>{item.label}</span>

                    <span style={{ marginLeft: 'auto' }}>
                      {active ? '●' : '○'}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* INFORMAÇÕES DO COMPONENTE */}

        <div
          style={{
            ...panelStyle,
            padding: '22px',
          }}
        >
          <div
            style={{
              ...monoStyle,
              color: COLORS.blue,
              fontSize: '10px',
              marginBottom: '17px',
            }}
          >
            02 / COMPONENT SPECIFICATION
          </div>

          <div
            style={{
              ...monoStyle,
              fontSize: '9px',
              color: COLORS.violet,
              marginBottom: '8px',
            }}
          >
            {selectedInfo.category}
          </div>

          <h3
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '25px',
              fontWeight: 400,
              margin: '0 0 14px',
              color: COLORS.text,
            }}
          >
            {selectedInfo.name}
          </h3>

          <p
            style={{
              fontSize: '12px',
              lineHeight: 1.8,
              color: COLORS.muted,
              margin: '0 0 15px',
            }}
          >
            {selectedInfo.description}
          </p>

          <div
            style={{
              borderTop: `1px solid ${COLORS.line}`,
              paddingTop: '13px',
            }}
          >
            <div
              style={{
                ...monoStyle,
                fontSize: '9px',
                color: COLORS.blue,
                marginBottom: '7px',
              }}
            >
              FUNCTION / OPERATION
            </div>

            <p
              style={{
                fontSize: '12px',
                lineHeight: 1.8,
                color: COLORS.text,
                margin: 0,
              }}
            >
              {selectedInfo.function}
            </p>
          </div>

          <div
            style={{
              borderTop: `1px solid ${COLORS.line}`,
              marginTop: '15px',
              paddingTop: '13px',
            }}
          >
            <div
              style={{
                ...monoStyle,
                fontSize: '9px',
                color: COLORS.blue,
                marginBottom: '9px',
              }}
            >
              TECHNICAL CHARACTERISTICS
            </div>

            <ul
              style={{
                margin: 0,
                paddingLeft: '17px',
                color: COLORS.muted,
                fontSize: '11px',
                lineHeight: 2,
              }}
            >
              {selectedInfo.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* RODAPÉ TÉCNICO */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '13px 0',
          ...monoStyle,
          fontSize: '9px',
          color: COLORS.muted,
        }}
      >
        <span>ENGINEERING ATLAS / SOFTWARE ENGINEERING</span>
        <span>MODEL SW-001 / REV. 01</span>
      </div>
    </section>
  )
}
