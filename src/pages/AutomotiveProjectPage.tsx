
import { Link } from 'react-router-dom'
import AutomotiveViewer from '../components/3d/AutomotiveViewer'
import ProjectGallery from '../components/ProjectGallery'
import './AutomotiveProjectPage.css'

const systems = [
  {
    number: '01',
    title: 'Disco de freio',
    description:
      'Elemento rotativo responsável por receber o atrito das pastilhas e transformar energia cinética em energia térmica.',
  },
  {
    number: '02',
    title: 'Pinça de freio',
    description:
      'Estrutura que abriga e posiciona as pastilhas, aplicando força sobre o disco durante a frenagem.',
  },
  {
    number: '03',
    title: 'Pastilhas',
    description:
      'Elementos de material de atrito que entram em contato com o disco para produzir desaceleração.',
  },
  {
    number: '04',
    title: 'Cubo de roda',
    description:
      'Componente que conecta o conjunto rotativo à roda e permite sua fixação ao sistema de suspensão.',
  },
  {
    number: '05',
    title: 'Roda',
    description:
      'Elemento que transmite ao solo as forças geradas pelo conjunto de pneu e sistema de frenagem.',
  },
]

export default function AutomotiveProjectPage() {
  return (
    <main className="automotive-project-page">
      <header className="automotive-project-header">
        <Link
          to="/engineering/automotive"
          className="automotive-back-link"
        >
          ← VOLTAR À ENGENHARIA
        </Link>

        <span className="automotive-header-label">
          ENGINEERING ATLAS / AUTOMOTIVA
        </span>
      </header>

      <section className="automotive-project-intro">
        <span className="automotive-eyebrow">
          PROJETO INTERATIVO 02 / SISTEMAS MECÂNICOS
        </span>

        <h1>
          Anatomia de um
          <span> sistema de freio</span>
        </h1>

        <p>
          Explore a arquitetura de um sistema de freio a disco.
          Identifique seus componentes, compreenda suas funções
          e investigue como os elementos trabalham em conjunto
          para controlar a velocidade de um veículo.
        </p>

        <div className="automotive-project-meta">
          <span>ÁREA: DINÂMICA VEICULAR</span>
          <span>SISTEMA: FREIO A DISCO</span>
          <span>VISUALIZAÇÃO: 3D INTERATIVA</span>
        </div>
      </section>

      <section className="automotive-viewer-section">
        <div className="automotive-section-heading">
          <div>
            <span className="automotive-eyebrow">
              EXPLORAÇÃO TÉCNICA
            </span>
            <h2>Conjunto de frenagem</h2>
          </div>

          <span className="automotive-section-index">FIG. 02.01</span>
        </div>

        <AutomotiveViewer />
      </section>

      <section className="automotive-systems-section">
        <div className="automotive-section-heading">
          <div>
            <span className="automotive-eyebrow">
              ARQUITETURA DO SISTEMA
            </span>
            <h2>Elementos fundamentais</h2>
          </div>
        </div>

        <div className="automotive-systems-grid">
          {systems.map((system) => (
            <article
              className="automotive-system-card"
              key={system.number}
            >
              <span>{system.number}</span>
              <h3>{system.title}</h3>
              <p>{system.description}</p>
            </article>
          ))}
        </div>
      </section>

      <ProjectGallery projectId="automotive" />

      <footer className="automotive-project-footer">
        <span>ENGINEERING ATLAS</span>
        <span>ENGENHARIA AUTOMOTIVA / 02</span>
      </footer>
    </main>
  )
}
