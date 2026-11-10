
import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BrakeSystemModel from './BrakeSystemModel'

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

export default function AutomotiveViewer() {
  const [selectedComponent, setSelectedComponent] = useState('disc')
  const [exploded, setExploded] = useState(false)

  const selectedInfo = componentInfo[selectedComponent]

  const selectComponent = (id: string) => {
    setSelectedComponent(id)
  }

  return (
    <div>
      {/* Controles de visualização */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '14px',
        }}
      >
        <span
          style={{
            color: '#929299',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
          }}
        >
          MODO DE VISUALIZAÇÃO
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setExploded(false)}
            style={{
              padding: '10px 16px',
              border: '1px solid #38383d',
              borderRadius: '5px',
              background: !exploded ? '#ef5555' : '#191a1e',
              color: !exploded ? '#111214' : '#c0c0c5',
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
            }}
          >
            VISTA INTEGRADA
          </button>

          <button
            onClick={() => setExploded(true)}
            style={{
              padding: '10px 16px',
              border: '1px solid #38383d',
              borderRadius: '5px',
              background: exploded ? '#ef5555' : '#191a1e',
              color: exploded ? '#111214' : '#c0c0c5',
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
            }}
          >
            VISTA EXPLODIDA
          </button>
        </div>
      </div>

      {/* Modelo e navegador de componentes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 250px',
          gap: '14px',
          alignItems: 'stretch',
        }}
      >
        {/* Visualizador 3D */}
        <div
          style={{
            minWidth: 0,
            height: '520px',
            background: '#111214',
            border: '1px solid #303034',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Canvas
            camera={{
              position: [5, 4, 7],
              fov: 45,
            }}
            shadows
          >
            <color attach="background" args={['#111214']} />

            <ambientLight intensity={1.2} />

            <directionalLight
              position={[5, 6, 5]}
              intensity={2.2}
              castShadow
            />

            <pointLight
              position={[-4, -2, -3]}
              intensity={1.3}
            />

            <Suspense fallback={null}>
              <BrakeSystemModel
                onSelect={selectComponent}
                selectedComponent={selectedComponent}
                exploded={exploded}
              />
            </Suspense>

            <OrbitControls
              enablePan
              enableZoom
              enableRotate
              minDistance={3}
              maxDistance={15}
            />
          </Canvas>
        </div>

        {/* Navegador de componentes */}
        <aside
          style={{
            padding: '20px 15px',
            background: '#191a1e',
            border: '1px solid #343438',
            borderRadius: '10px',
          }}
        >
          <span
            style={{
              color: '#ef5555',
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
              color: '#eeeeef',
              fontSize: '17px',
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
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
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
                      marginBottom: '4px',
                      border: active
                        ? '1px solid #a33c3c'
                        : '1px solid transparent',
                      borderRadius: '5px',
                      background: active ? '#302020' : 'transparent',
                      color: active ? '#ef7777' : '#c0c0c5',
                      textAlign: 'left',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                      }}
                    >
                      {item.number}
                    </span>

                    <span style={{ flex: 1 }}>{item.name}</span>

                    {active && <span>●</span>}
                  </button>
                )
              })}
            </div>
          ))}

          <div
            style={{
              marginTop: '22px',
              paddingTop: '14px',
              borderTop: '1px solid #38383d',
              color: '#929299',
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

      {/* Legenda da vista explodida */}
      {exploded && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '14px',
            marginTop: '14px',
            color: '#929299',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
          }}
        >
          <span style={{ color: '#aeb4bd' }}>● DISCO</span>
          <span style={{ color: '#ef5555' }}>● PINÇA</span>
          <span style={{ color: '#c68b58' }}>● PASTILHAS</span>
          <span style={{ color: '#888f9a' }}>● CUBO</span>
          <span style={{ color: '#62666d' }}>● RODA</span>
        </div>
      )}

      {/* Painel de informações */}
      <section
        style={{
          marginTop: '18px',
          padding: '25px',
          background: '#191a1e',
          border: '1px solid #343438',
          borderRadius: '10px',
        }}
      >
        <span
          style={{
            color: '#ef5555',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            letterSpacing: '0.08em',
          }}
        >
          COMPONENTE {selectedInfo.number} / {selectedInfo.category}
        </span>

        <h3
          style={{
            margin: '12px 0',
            fontSize: '23px',
            color: '#eeeeef',
          }}
        >
          {selectedInfo.title}
        </h3>

        <p
          style={{
            maxWidth: '800px',
            color: '#a4a4a9',
            fontSize: '14px',
            lineHeight: 1.8,
          }}
        >
          {selectedInfo.description}
        </p>

        <ul
          style={{
            paddingLeft: '20px',
            color: '#c0c0c5',
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
            marginTop: '20px',
            color: '#929299',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
          }}
        >
          SELECIONE UM COMPONENTE NO MODELO OU NA LISTA PARA EXPLORÁ-LO
        </span>
      </section>
    </div>
  )
}
