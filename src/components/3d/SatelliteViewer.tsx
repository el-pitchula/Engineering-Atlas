
import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import SatelliteModel from './SatelliteModel'

const COLORS = {
  background: '#0b1628',
  surface: '#14243a',
  surfaceLight: '#1b3049',
  line: '#2b4059',
  blue: '#8bb9e8',
  red: '#e05252',
  text: '#f0f4fa',
  muted: '#9aabc0',
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
  structure: {
    number: '01',
    title: 'Estrutura primária',
    category: 'SUBSISTEMA ESTRUTURAL',
    description:
      'A estrutura primária sustenta os equipamentos do satélite, mantém sua integridade mecânica e transmite cargas durante o lançamento e a operação.',
    details: [
      'Suporta os equipamentos e instrumentos.',
      'Resiste às cargas mecânicas do lançamento.',
      'Mantém o alinhamento dos subsistemas.',
    ],
  },

  'solar-panels': {
    number: '02',
    title: 'Painéis solares',
    category: 'SUBSISTEMA DE ENERGIA',
    description:
      'Os painéis solares convertem a radiação solar em energia elétrica por meio do efeito fotovoltaico.',
    details: [
      'Células fotovoltaicas convertem luz em eletricidade.',
      'A geração depende da orientação e iluminação solar.',
      'A energia pode ser armazenada em baterias.',
    ],
  },

  antenna: {
    number: '03',
    title: 'Antena de comunicação',
    category: 'SUBSISTEMA DE COMUNICAÇÃO',
    description:
      'A antena transmite e recebe sinais eletromagnéticos, integrando o enlace de comunicação entre o satélite e as estações terrestres.',
    details: [
      'Transmite telemetria e dados da missão.',
      'Recebe comandos enviados pelas estações em solo.',
      'Seu desempenho depende de frequência, ganho e orientação.',
    ],
  },

  battery: {
    number: '04',
    title: 'Bateria',
    category: 'SUBSISTEMA DE ENERGIA',
    description:
      'A bateria armazena energia elétrica para alimentar os equipamentos durante períodos em que os painéis solares não recebem iluminação suficiente.',
    details: [
      'Armazena energia gerada pelos painéis solares.',
      'Fornece energia durante eclipses orbitais.',
      'Exige controle de carga, descarga e temperatura.',
    ],
  },

  computer: {
    number: '05',
    title: 'Computador de bordo',
    category: 'SUBSISTEMA DE CONTROLE',
    description:
      'O computador de bordo processa informações, executa comandos e coordena diferentes funções da missão.',
    details: [
      'Processa dados provenientes dos sensores.',
      'Executa comandos e rotinas operacionais.',
      'Coordena operações entre subsistemas.',
    ],
  },

  payload: {
    number: '06',
    title: 'Carga útil',
    category: 'SISTEMA DE MISSÃO',
    description:
      'A carga útil é o conjunto de instrumentos e equipamentos responsáveis por cumprir o objetivo principal da missão espacial.',
    details: [
      'Pode incluir câmeras, sensores ou instrumentos científicos.',
      'Realiza a coleta de dados da missão.',
      'Suas características dependem da finalidade do satélite.',
    ],
  },
}

const componentGroups = [
  {
    name: 'Estrutura',
    items: [
      { id: 'structure', name: 'Estrutura primária', number: '01' },
    ],
  },
  {
    name: 'Energia',
    items: [
      { id: 'solar-panels', name: 'Painéis solares', number: '02' },
      { id: 'battery', name: 'Bateria', number: '04', internal: true },
    ],
  },
  {
    name: 'Comunicação',
    items: [
      { id: 'antenna', name: 'Antena', number: '03' },
    ],
  },
  {
    name: 'Controle e missão',
    items: [
      { id: 'computer', name: 'Computador de bordo', number: '05', internal: true },
      { id: 'payload', name: 'Carga útil', number: '06', internal: true },
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

export default function SatelliteViewer() {
  const [selectedComponent, setSelectedComponent] = useState('structure')
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
              color: COLORS.blue,
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
            CUBESAT 3U / INSPEÇÃO DIGITAL
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
          {/* Identificação da cena */}

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
                color: COLORS.blue,
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
                color: '#667e99',
                fontFamily: 'DM Mono, monospace',
                fontSize: '9px',
              }}
            >
              SATELLITE SYSTEM / 001
            </div>
          </div>

          {/* Indicador de orientação */}

          <div
            style={{
              position: 'absolute',
              zIndex: 2,
              right: '18px',
              top: '17px',
              color: '#71869e',
              fontFamily: 'DM Mono, monospace',
              fontSize: '9px',
              textAlign: 'right',
              pointerEvents: 'none',
              lineHeight: 1.8,
            }}
          >
            <div>3D VIEW</div>
            <div>ORBITAL SYSTEM</div>
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

            <fog
              attach="fog"
              args={[COLORS.background, 13, 28]}
            />

            {/* ILUMINAÇÃO AMBIENTE */}

            <ambientLight intensity={0.65} />

            <hemisphereLight
              args={['#d8e9ff', '#17263b', 1.15]}
            />

            {/* LUZ PRINCIPAL */}

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

            {/* LUZ DE PREENCHIMENTO AZUL */}

            <pointLight
              position={[-5, 1, -4]}
              intensity={1.6}
              color="#5d91c3"
              distance={15}
            />

            {/* LUZ DE CONTORNO */}

            <pointLight
              position={[3, -2, 5]}
              intensity={1.1}
              color="#8bb9e8"
              distance={12}
            />

            {/* REFLEXO SUPERIOR */}

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
              args={[12, 24, '#29435f', '#182d45']}
              position={[0, -2.15, 0]}
            />

            <Suspense fallback={null}>
              <SatelliteModel
                onSelect={selectComponent}
                selectedComponent={selectedComponent}
                exploded={exploded}
              />

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
              color: '#71869e',
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
              color: COLORS.blue,
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
            borderTop: `2px solid ${COLORS.blue}`,
            borderBottom: `1px solid ${COLORS.line}`,
          }}
        >
          <span
            style={{
              color: COLORS.blue,
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
                  color: '#70869e',
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
                const disabled = item.internal && !exploded

                return (
                  <button
                    key={item.id}
                    disabled={disabled}
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
                      background: active ? '#203650' : 'transparent',
                      color: disabled
                        ? '#526174'
                        : active
                          ? COLORS.text
                          : '#b4c5d7',
                      textAlign: 'left',
                      fontSize: '11px',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.45 : 1,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        color: active ? COLORS.red : COLORS.blue,
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                      }}
                    >
                      {item.number}
                    </span>

                    <span style={{ flex: 1 }}>{item.name}</span>

                    {active && (
                      <span
                        style={{
                          color: COLORS.red,
                          fontSize: '9px',
                        }}
                      >
                        ●
                      </span>
                    )}

                    {disabled && (
                      <span style={{ fontSize: '9px' }}>LOCK</span>
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
              ? 'Todos os componentes estão disponíveis para exploração.'
              : 'Ative a vista explodida para acessar os módulos internos.'}
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
          <span style={{ color: COLORS.blue }}>● ESTRUTURA</span>
          <span style={{ color: '#c5a66a' }}>● BATERIA</span>
          <span style={{ color: '#75b69a' }}>● COMPUTADOR</span>
          <span style={{ color: '#8ba9c9' }}>● CARGA ÚTIL</span>
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
            color: COLORS.blue,
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
            color: '#c1cede',
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
            color: '#71869e',
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
