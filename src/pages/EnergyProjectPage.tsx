
import { Link } from 'react-router-dom'
import WindTurbineViewer from '../components/3d/WindTurbineViewer'
import ProjectGallery from '../components/ProjectGallery'
import './EnergyProjectPage.css'

const systems = [
  {
    number: '01',
    title: 'Pás aerodinâmicas',
    description:
      'Elementos responsáveis por interagir com o fluxo de ar e converter a energia cinética do vento em movimento rotacional.',
  },
  {
    number: '02',
    title: 'Braços do rotor',
    description:
      'Elementos estruturais que conectam as pás ao eixo central e transmitem os esforços mecânicos produzidos durante a rotação.',
  },
  {
    number: '03',
    title: 'Eixo central',
    description:
      'Componente responsável por transmitir o torque produzido pelo rotor ao sistema de conversão eletromecânica.',
  },
  {
    number: '04',
    title: 'Mancais',
    description:
      'Elementos de apoio que sustentam o eixo, mantêm seu alinhamento e permitem a rotação com menor atrito.',
  },
  {
    number: '05',
    title: 'Gerador elétrico',
    description:
      'Dispositivo que converte a energia mecânica de rotação em energia elétrica por meio da indução eletromagnética.',
  },
]

export default function EnergyProjectPage() {
  return (
    <main className="energy-project-page">
      <header className="energy-project-header">
        <Link
          to="/engineering/energy"
          className="energy-back-link"
        >
          ← VOLTAR À ENGENHARIA
        </Link>

        <span className="energy-header-label">
          ENGINEERING ATLAS / ENERGIA
        </span>
      </header>

      <section className="energy-project-intro">
        <span className="energy-eyebrow">
          PROJETO INTERATIVO 03 / SISTEMAS DE CONVERSÃO
        </span>

        <h1>
          Anatomia de uma
          <span> turbina eólica</span>
        </h1>

        <p>
          Explore a arquitetura de uma turbina eólica de eixo vertical
          do tipo Darrieus. Identifique seus componentes, compreenda
          os princípios de conversão de energia e investigue como
          os elementos mecânicos e elétricos trabalham em conjunto
          para transformar a energia do vento em eletricidade.
        </p>

        <div className="energy-project-meta">
          <span>ÁREA: ENERGIAS RENOVÁVEIS</span>
          <span>SISTEMA: TURBINA DARRIEUS</span>
          <span>VISUALIZAÇÃO: 3D INTERATIVA</span>
        </div>
      </section>

      <section className="energy-viewer-section">
        <div className="energy-section-heading">
          <div>
            <span className="energy-eyebrow">
              EXPLORAÇÃO TÉCNICA
            </span>
            <h2>Sistema de conversão eólica</h2>
          </div>

          <span className="energy-section-index">FIG. 03.01</span>
        </div>

        <WindTurbineViewer />
      </section>

      <section className="energy-systems-section">
        <div className="energy-section-heading">
          <div>
            <span className="energy-eyebrow">
              ARQUITETURA DO SISTEMA
            </span>
            <h2>Elementos fundamentais</h2>
          </div>
        </div>

        <div className="energy-systems-grid">
          {systems.map((system) => (
            <article
              className="energy-system-card"
              key={system.number}
            >
              <span>{system.number}</span>
              <h3>{system.title}</h3>
              <p>{system.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ProjectGallery projectId="energy" />

      <footer className="energy-project-footer">
        <span>ENGINEERING ATLAS</span>
        <span>ENGENHARIA DE ENERGIA / 03</span>
      </footer>
    </main>
  )
}
