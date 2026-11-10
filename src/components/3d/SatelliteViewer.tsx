
import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import SatelliteModel from './SatelliteModel'

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

export default function SatelliteViewer() {
  const [selectedComponent, setSelectedComponent] = useState('structure')
  const [exploded, setExploded] = useState(false)

  const selectedInfo = componentInfo[selectedComponent]

  return (
    <div>
      {/* Controles do visualizador */}
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
            color: '#929b91',
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
              border: '1px solid #303a32',
              borderRadius: '5px',
              background: !exploded ? '#c6f36a' : '#171c19',
              color: !exploded ? '#101311' : '#b9c2b5',
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
              border: '1px solid #303a32',
              borderRadius: '5px',
              background: exploded ? '#c6f36a' : '#171c19',
              color: exploded ? '#101311' : '#b9c2b5',
              cursor: 'pointer',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
            }}
          >
            VISTA EXPLODIDA
          </button>
        </div>
      </div>

      {/* Modelo 3D */}
      <div
        style={{
          width: '100%',
          height: '520px',
          background: '#101713',
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
          <color attach="background" args={['#101713']} />

          <ambientLight intensity={1.1} />

          <directionalLight
            position={[5, 6, 5]}
            intensity={2.2}
            castShadow
          />

          <pointLight position={[-4, -2, -3]} intensity={1.2} />

          <Suspense fallback={null}>
            <SatelliteModel
              onSelect={setSelectedComponent}
              selectedComponent={selectedComponent}
              exploded={exploded}
            />

            <Stars
              radius={80}
              depth={40}
              count={1500}
              factor={3}
              saturation={0}
              fade
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

      {/* Legenda */}
      {exploded && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '14px',
            color: '#929b91',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
          }}
        >
          <span>● ESTRUTURA</span>
          <span style={{ color: '#b58b43' }}>● BATERIA</span>
          <span style={{ color: '#548b78' }}>● COMPUTADOR</span>
          <span style={{ color: '#7389a6' }}>● CARGA ÚTIL</span>
        </div>
      )}

      {/* Painel de informações */}
      <section
        style={{
          marginTop: '18px',
          padding: '25px',
          background: '#171c19',
          border: '1px solid #303a32',
          borderRadius: '10px',
        }}
      >
        <span
          style={{
            color: '#c6f36a',
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
            color: '#edf1e9',
          }}
        >
          {selectedInfo.title}
        </h3>

        <p
          style={{
            maxWidth: '800px',
            color: '#929b91',
            fontSize: '14px',
            lineHeight: 1.8,
          }}
        >
          {selectedInfo.description}
        </p>

        <ul
          style={{
            paddingLeft: '20px',
            color: '#b9c2b5',
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
            color: '#929b91',
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
          }}
        >
          SELECIONE UM COMPONENTE NO MODELO 3D PARA EXPLORÁ-LO
        </span>
      </section>
    </div>
  )
}
