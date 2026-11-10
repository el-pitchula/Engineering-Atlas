
import { Link } from 'react-router-dom'
import SatelliteViewer from '../components/3d/SatelliteViewer'
import './SatelliteProjectPage.css'

const systems = [
  {
    number: '01',
    name: 'Estrutura',
    description:
      'O corpo estrutural abriga os equipamentos e fornece suporte mecânico aos sistemas do satélite.',
    components: ['Estrutura primária', 'Painéis externos', 'Interfaces mecânicas'],
  },
  {
    number: '02',
    name: 'Energia',
    description:
      'O subsistema de energia capta, armazena e distribui eletricidade para os demais equipamentos.',
    components: ['Painéis solares', 'Baterias', 'Unidade de distribuição'],
  },
  {
    number: '03',
    name: 'Comunicação',
    description:
      'Responsável pela transmissão de dados entre o satélite e as estações em solo.',
    components: ['Antenas', 'Transceptores', 'Unidade de processamento'],
  },
  {
    number: '04',
    name: 'Controle e orientação',
    description:
      'Determina e controla a atitude do satélite, permitindo orientar seus instrumentos e antenas.',
    components: ['Sensores de atitude', 'Unidade de controle', 'Atuadores'],
  },
]

export default function SatelliteProjectPage() {
  return (
    <main className="satellite-page">
      <header className="satellite-header">
        <Link to="/" className="satellite-brand">
          ENGINEERING ATLAS
        </Link>

        <span className="satellite-header-label">
          UNB / FGA — AEROSPACE ENGINEERING
        </span>
      </header>

      <div className="satellite-content">
        <nav className="satellite-breadcrumb">
          <Link to="/">Atlas</Link>
          <span>/</span>
          <Link to="/engineering/aerospace">Engenharia Aeroespacial</Link>
          <span>/</span>
          <span>Anatomia de um satélite</span>
        </nav>

        <section className="satellite-intro">
          <div className="satellite-eyebrow">
            <span className="satellite-status-dot" />
            PROJETO 01 — EXPLORAÇÃO TÉCNICA
          </div>

          <h1>Anatomia de um satélite</h1>

          <p>
            Explore a arquitetura de um sistema espacial e conheça os
            subsistemas que permitem a um satélite operar em órbita.
          </p>
        </section>

        <section className="satellite-explorer">
          <div className="satellite-viewer-heading">
            <div>
              <span className="satellite-section-label">VISUALIZADOR 3D</span>
              <h2>Modelo estrutural</h2>
            </div>

            <span className="satellite-viewer-hint">
              ARRASTE PARA ROTACIONAR
            </span>
          </div>

          <SatelliteViewer />

          <div className="satellite-viewer-caption">
            <span>MODELO CONCEITUAL</span>
            <span>Visualização interativa · Protótipo inicial</span>
          </div>
        </section>

        <section className="satellite-systems">
          <div className="satellite-section-heading">
            <span className="satellite-section-label">ARQUITETURA DO SISTEMA</span>
            <h2>Conheça os subsistemas</h2>
            <p>
              Um satélite é formado por diferentes subsistemas que trabalham
              de maneira integrada para cumprir sua missão.
            </p>
          </div>

          <div className="satellite-system-grid">
            {systems.map((system) => (
              <article className="satellite-system-card" key={system.number}>
                <span className="satellite-system-number">{system.number}</span>
                <h3>{system.name}</h3>
                <p>{system.description}</p>

                <div className="satellite-component-list">
                  {system.components.map((component) => (
                    <span key={component}>{component}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <footer className="satellite-footer">
          <Link to="/engineering/aerospace">
            ← Voltar para Engenharia Aeroespacial
          </Link>

          <span>ENGINEERING ATLAS · UNB / FGA</span>
        </footer>
      </div>
    </main>
  )
}
