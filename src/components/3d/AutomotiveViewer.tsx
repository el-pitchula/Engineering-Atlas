
import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Html, Text, Edges } from '@react-three/drei'
import * as THREE from 'three'
import BrakeSystemModel from './BrakeSystemModel'

const COLORS = {
  background: '#111214',
  surface: '#202326',
  line: '#3b3e40',
  red: '#ef6969',
  text: '#f1f1ef',
  muted: '#a2a5a7',
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
  disc: {
    number: '01',
    title: 'Disco de freio',
    category: 'ELEMENTO DE FRENAGEM',
    description:
      'O disco de freio é um componente rotativo conectado ao cubo da roda. Durante a frenagem, recebe o atrito das pastilhas e converte parte da energia cinética do veículo em energia térmica.',
    details: [
      'Gira solidariamente com o conjunto da roda.',
      'Recebe o contato de atrito das pastilhas.',
      'Precisa dissipar o calor gerado durante a frenagem.',
    ],
  },
  caliper: {
    number: '02',
    title: 'Pinça de freio',
    category: 'ACIONAMENTO MECÂNICO',
    description:
      'A pinça envolve parcialmente o disco e abriga os mecanismos que pressionam as pastilhas contra suas superfícies. Nos sistemas hidráulicos, essa força é produzida pela pressão do fluido de freio.',
    details: [
      'Posiciona as pastilhas em relação ao disco.',
      'Abriga os pistões responsáveis pela aplicação da força.',
      'Transmite a força de frenagem ao conjunto de atrito.',
    ],
  },
  pads: {
    number: '03',
    title: 'Pastilhas de freio',
    category: 'ELEMENTOS DE ATRITO',
    description:
      'As pastilhas possuem material de atrito desenvolvido para trabalhar em contato com o disco. A pressão aplicada sobre elas produz a força responsável pela desaceleração do conjunto rotativo.',
    details: [
      'Trabalham em pares, posicionadas em lados opostos do disco.',
      'Transformam energia cinética em calor por atrito.',
      'São componentes sujeitos a desgaste e substituição periódica.',
    ],
  },
  hub: {
    number: '04',
    title: 'Cubo de roda',
    category: 'CONJUNTO ROTATIVO',
    description:
      'O cubo de roda conecta o disco ao conjunto de roda e ao sistema de rolamento. É responsável por manter o posicionamento e transmitir os esforços mecânicos entre esses elementos.',
    details: [
      'Conecta o disco ao conjunto rotativo.',
      'Permite a fixação da roda por parafusos ou prisioneiros.',
      'Trabalha em conjunto com o rolamento da roda.',
    ],
  },
  wheel: {
    number: '05',
    title: 'Roda',
    category: 'CONJUNTO RODANTE',
    description:
      'A roda é a estrutura que recebe o pneu e se conecta ao cubo. No conjunto de frenagem, sua geometria também influencia o espaço disponível para acomodar o disco e a pinça.',
    details: [
      'Recebe e sustenta o pneu.',
      'Transmite esforços entre o veículo e o solo.',
      'Sua geometria interfere na acomodação dos componentes de freio.',
    ],
  },
}

const componentGroups = [
  {
    name: 'Frenagem',
    items: [
      { id: 'disc', name: 'Disco de freio', number: '01' },
      { id: 'caliper', name: 'Pinça de freio', number: '02' },
      { id: 'pads', name: 'Pastilhas', number: '03' },
    ],
  },
  {
    name: 'Conjunto rotativo',
    items: [
      { id: 'hub', name: 'Cubo de roda', number: '04' },
      { id: 'wheel', name: 'Roda', number: '05' },
    ],
  },
]

const buttonStyle = (active: boolean): React.CSSProperties => ({
  padding: '10px 15px',
  border: `1px solid ${active ? COLORS.red : COLORS.line}`,
  borderRadius: '3px',
  background: active ? COLORS.red : 'transparent',
  color: active ? '#ffffff' : COLORS.muted,
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
          color={texture ? '#ffffff' : '#202326'}
          transparent={!texture}
          opacity={texture ? 1 : 0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={1}
        />

        <Edges color="#686b70" threshold={15} lineWidth={1} />
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
            color="#ef6969"
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
            color="#d0d0d0"
            anchorX="center"
            anchorY="middle"
            textAlign="center"
            maxWidth={width - 0.3}
          >
            {subtitle}
          </Text>

          <mesh position={[0, -0.42, 0]}>
            <planeGeometry args={[1.65, 0.008]} />
            <meshBasicMaterial color="#55585c" />
          </mesh>

          <Text
            position={[0, -0.58, 0]}
            fontSize={0.085}
            color="#929299"
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

function AutomotiveTechnicalReferences() {
  return (
    <group>
      {/* 01 — VISTA FRONTAL */}

      <ReferencePlane
        title="01 / FRONT VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA FRONTAL"
        imagePath="/projects/automotive/front-view.png"
        position={[0, 0, -3.6]}
        rotation={[0, 0, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 02 — VISTA LATERAL */}

      <ReferencePlane
        title="02 / SIDE VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA LATERAL"
        imagePath="/projects/automotive/side-view.png"
        position={[-4.5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        width={4.5}
        height={3.0}
      />

      {/* 03 — VISTA SUPERIOR */}

      <ReferencePlane
        title="03 / TOP VIEW"
        subtitle="PROJEÇÃO ORTOGRÁFICA SUPERIOR"
        imagePath="/projects/automotive/top-view.png"
        position={[0, -1.7, 0]}
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

export default function AutomotiveViewer() {
  const [selectedComponent, setSelectedComponent] = useState('disc')
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
              color: COLORS.red,
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
            BRAKE SYSTEM / INSPEÇÃO DIGITAL
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
                color: COLORS.red,
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
                color: '#929299',
                fontFamily: 'DM Mono, monospace',
                fontSize: '9px',
              }}
            >
              BRAKE SYSTEM / 002
            </div>
          </div>

          {/* INDICADOR DE ORIENTAÇÃO */}

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              right: '18px',
              top: '17px',
              color: '#929299',
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              textAlign: 'right',
              pointerEvents: 'none',
              lineHeight: 1.8,
            }}
          >
            <div>3D VIEW</div>
            <div>MECHANICAL SYSTEM</div>
          </div>

          <Canvas
            camera={{
              position: [5, 4, 7],
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

            <fog attach="fog" args={[COLORS.background, 14, 30]} />

            {/* ILUMINAÇÃO */}

            <ambientLight intensity={0.85} />

            <hemisphereLight
              args={['#eeeeee', '#292b2e', 1.1]}
            />

            <directionalLight
              position={[5, 8, 6]}
              intensity={2.5}
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
              intensity={1.4}
              color="#b9c2d0"
              distance={15}
            />

            <pointLight
              position={[3, -2, 5]}
              intensity={1.1}
              color="#ef6969"
              distance={12}
            />

            <spotLight
              position={[0, 7, 2]}
              intensity={1.2}
              color="#ffffff"
              angle={0.65}
              penumbra={0.8}
              distance={15}
            />

            {/* GRADE DE REFERÊNCIA */}

            <gridHelper
              args={[14, 28, '#55585c', '#292c30']}
              position={[0, -1.75, 0]}
            />

            <Suspense fallback={null}>
              <BrakeSystemModel
                onSelect={selectComponent}
                selectedComponent={selectedComponent}
                exploded={exploded}
              />

              <AutomotiveTechnicalReferences />
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
              minDistance={3}
              maxDistance={16}
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
              color: '#929299',
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
              color: COLORS.red,
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
            borderTop: `2px solid ${COLORS.red}`,
            borderBottom: `1px solid ${COLORS.line}`,
          }}
        >
          <span
            style={{
              color: COLORS.red,
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              letterSpacing: '0.08em',
            }}
          >
            ARQUITETURA MECÂNICA
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
                  color: '#929299',
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
                        active ? COLORS.red : 'transparent'
                      }`,
                      background: active ? '#302020' : 'transparent',
                      color: active ? COLORS.text : '#c0c0c5',
                      textAlign: 'left',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        color: COLORS.red,
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                      }}
                    >
                      {item.number}
                    </span>

                    <span style={{ flex: 1 }}>{item.name}</span>

                    {active && (
                      <span style={{ color: COLORS.red, fontSize: '9px' }}>
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
          <span style={{ color: '#aeb4bd' }}>● DISCO</span>
          <span style={{ color: '#ef5555' }}>● PINÇA</span>
          <span style={{ color: '#c68b58' }}>● PASTILHAS</span>
          <span style={{ color: '#888f9a' }}>● CUBO</span>
          <span style={{ color: '#777e88' }}>● RODA</span>
        </div>
      )}

      {/* PAINEL DE INFORMAÇÕES */}

      <section
        style={{
          position: 'relative',
          marginTop: '22px',
          padding: '26px 28px',
          background: COLORS.surface,
          borderLeft: `3px solid ${COLORS.red}`,
          borderBottom: `1px solid ${COLORS.line}`,
        }}
      >
        <span
          style={{
            color: COLORS.red,
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
            color: '#c1c1c5',
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
            color: '#929299',
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
