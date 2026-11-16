
import { Link } from 'react-router-dom'
import ElectronicsViewer from '../components/3d/ElectronicsViewer'
import ProjectGallery from '../components/ProjectGallery'
import './ElectronicsProjectPage.css'

const systems = [
  {
    number: '01',
    title: 'Placa de circuito impresso',
    description:
      'Base física que sustenta os componentes e estabelece as conexões elétricas por meio de trilhas condutoras.',
  },
  {
    number: '02',
    title: 'Microcontrolador',
    description:
      'Unidade programável responsável pelo processamento de informações e pelo controle das operações do sistema.',
  },
  {
    number: '03',
    title: 'Regulador de tensão',
    description:
      'Circuito responsável por estabilizar a alimentação elétrica e fornecer níveis adequados aos componentes.',
  },
  {
    number: '04',
    title: 'Conectores',
    description:
      'Interfaces físicas e elétricas que permitem a comunicação, alimentação e integração com dispositivos externos.',
  },
  {
    number: '05',
    title: 'Sensores',
    description:
      'Dispositivos que detectam grandezas físicas e convertem essas informações em sinais elétricos.',
  },
  {
    number: '06',
    title: 'Componentes passivos',
    description:
      'Resistores e capacitores utilizados no controle de corrente, filtragem e condicionamento dos sinais elétricos.',
  },
]

export default function ElectronicsProjectPage() {
  return (
    <main className="electronics-project-page">
      <header className="electronics-project-header">
        <Link
          to="/engineering/electronics"
          className="electronics-back-link"
        >
          ← VOLTAR À ENGENHARIA
        </Link>

        <span className="electronics-header-label">
          ENGINEERING ATLAS / ELETRÔNICA
        </span>
      </header>

      <section className="electronics-project-intro">
        <span className="electronics-eyebrow">
          PROJETO INTERATIVO 04 / SISTEMAS ELETRÔNICOS
        </span>

        <h1>
          Anatomia de uma
          <span> placa eletrônica</span>
        </h1>

        <p>
          Explore a arquitetura de uma placa de controle embarcado.
          Identifique seus componentes, compreenda a organização
          dos circuitos e investigue como processamento, alimentação,
          aquisição de dados e interfaces trabalham em conjunto
          em um sistema eletrônico.
        </p>

        <div className="electronics-project-meta">
          <span>ÁREA: SISTEMAS EMBARCADOS</span>
          <span>SISTEMA: CONTROLE ELETRÔNICO</span>
          <span>VISUALIZAÇÃO: 3D INTERATIVA</span>
        </div>
      </section>

      <section className="electronics-viewer-section">
        <div className="electronics-section-heading">
          <div>
            <span className="electronics-eyebrow">
              EXPLORAÇÃO TÉCNICA
            </span>
            <h2>Arquitetura de controle embarcado</h2>
          </div>

          <span className="electronics-section-index">FIG. 04.01</span>
        </div>

        <ElectronicsViewer />
      </section>

      <section className="electronics-systems-section">
        <div className="electronics-section-heading">
          <div>
            <span className="electronics-eyebrow">
              ARQUITETURA DO SISTEMA
            </span>
            <h2>Elementos fundamentais</h2>
          </div>
        </div>

        <div className="electronics-systems-grid">
          {systems.map((system) => (
            <article
              className="electronics-system-card"
              key={system.number}
            >
              <span>{system.number}</span>
              <h3>{system.title}</h3>
              <p>{system.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ProjectGallery projectId="electronics" />

      <footer className="electronics-project-footer">
        <span>ENGINEERING ATLAS</span>
        <span>ENGENHARIA ELETRÔNICA / 04</span>
      </footer>
    </main>
  )
}
