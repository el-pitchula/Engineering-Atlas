
import { useState } from 'react'
import './App.css'

const disciplines = [
  {
    id: 'aerospace',
    number: '01',
    name: 'Engenharia Aeroespacial',
    short: 'AEROESPACIAL',
    description:
      'Explore sistemas projetados para operar além da atmosfera terrestre, da estrutura de aeronaves à arquitetura de satélites.',
    project: 'Anatomia de um satélite',
    projectDescription:
      'Investigue a estrutura, os subsistemas e as decisões de projeto que permitem a um satélite operar em órbita.',
    symbol: 'A',
    status: 'PROJETO-PILOTO',
  },
  {
    id: 'electronics',
    number: '02',
    name: 'Engenharia Eletrônica',
    short: 'ELETRÔNICA',
    description:
      'Descubra como circuitos, sensores e sistemas embarcados transformam sinais elétricos em funções inteligentes.',
    project: 'Arquitetura de um circuito',
    projectDescription:
      'Conheça os componentes eletrônicos, suas conexões e como eles formam um sistema funcional.',
    symbol: 'E',
    status: 'PLANEJADO',
  },
  {
    id: 'mechanical',
    number: '03',
    name: 'Engenharia Mecânica',
    short: 'MECÂNICA',
    description:
      'Explore mecanismos, materiais, transmissão de movimento e os princípios por trás de máquinas e estruturas.',
    project: 'Anatomia de uma máquina',
    projectDescription:
      'Explore a montagem de um mecanismo e entenda a função de cada elemento em seu funcionamento.',
    symbol: 'M',
    status: 'PLANEJADO',
  },
  {
    id: 'software',
    number: '04',
    name: 'Engenharia de Software',
    short: 'SOFTWARE',
    description:
      'Entenda como sistemas computacionais são concebidos, estruturados e desenvolvidos para resolver problemas.',
    project: 'Arquitetura de um sistema',
    projectDescription:
      'Investigue os componentes de uma aplicação, suas responsabilidades e a comunicação entre módulos.',
    symbol: 'S',
    status: 'PLANEJADO',
  },
]

const stages = [
  {
    number: '01',
    title: 'Problema',
    description: 'Identificar uma necessidade e definir o que precisa ser resolvido.',
  },
  {
    number: '02',
    title: 'Concepção',
    description: 'Investigar alternativas e estabelecer os requisitos do sistema.',
  },
  {
    number: '03',
    title: 'Projeto',
    description: 'Definir componentes, materiais, dimensões e arquitetura.',
  },
  {
    number: '04',
    title: 'Construção',
    description: 'Integrar os elementos e materializar a solução projetada.',
  },
  {
    number: '05',
    title: 'Validação',
    description: 'Verificar se o sistema atende aos requisitos estabelecidos.',
  },
]

function App() {
  const [selectedId, setSelectedId] = useState('aerospace')

  const selectedDiscipline =
    disciplines.find((discipline) => discipline.id === selectedId) ??
    disciplines[0]

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Engineering Atlas, início">
          <span className="brand-mark">EA</span>
          <span className="brand-name">
            ENGINEERING
            <strong>ATLAS</strong>
          </span>
        </a>

        <nav className="navigation">
          <a href="#explorar">Explorar</a>
          <a href="#projeto">Projetos</a>
          <a href="#processo">Processo de engenharia</a>
        </nav>

        <a className="topbar-index" href="#explorar">
          ATLAS <span>001</span>
        </a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-grid" aria-hidden="true" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="status-dot" />
            UM ATLAS INTERATIVO DE ENGENHARIA
          </div>

          <h1>
            Entenda como
            <br />
            as coisas <span>são feitas.</span>
          </h1>

          <p className="hero-description">
            Explore sistemas, descubra seus componentes e acompanhe o processo
            de desenvolvimento por trás das soluções de engenharia.
          </p>

          <div className="hero-actions">
            <a className="button-primary" href="#explorar">
              Explorar engenharias <span>↗</span>
            </a>
            <a className="button-secondary" href="#processo">
              Conhecer o processo
            </a>
          </div>
        </div>

        <div className="hero-visual" aria-label="Ilustração técnica abstrata">
          <div className="technical-frame">
            <div className="frame-label frame-label-top">FIG. 001 / SYSTEMS</div>
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <div className="core">
              <span>EA</span>
            </div>
            <span className="axis axis-x">X</span>
            <span className="axis axis-y">Y</span>
            <span className="axis axis-z">Z</span>
            <div className="frame-label frame-label-bottom">
              ENGINEERING / EXPLORATION
            </div>
          </div>
          <span className="visual-caption">FIG. 01 — SYSTEMS IN CONTEXT</span>
        </div>

        <div className="hero-footer">
          <span>CONHECIMENTO APLICADO</span>
          <span>01 / 04 — ÁREAS DE ENGENHARIA</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      <section className="explorer section-padding" id="explorar">
        <div className="section-heading">
          <div>
            <div className="eyebrow">01 — EXPLORAÇÃO</div>
            <h2>Engenharias <span>em perspectiva.</span></h2>
          </div>
          <p>
            Cada área apresenta diferentes formas de compreender problemas,
            projetar sistemas e transformar ideias em soluções.
          </p>
        </div>

        <div className="discipline-grid">
          {disciplines.map((discipline) => (
            <button
              className={`discipline-card ${
                selectedId === discipline.id ? 'selected' : ''
              }`}
              key={discipline.id}
              onClick={() => setSelectedId(discipline.id)}
              aria-pressed={selectedId === discipline.id}
            >
              <div className="card-top">
                <span>{discipline.number} / DISCIPLINA</span>
                <span className="card-arrow">↗</span>
              </div>
              <div className="discipline-symbol">{discipline.symbol}</div>
              <h3>{discipline.name}</h3>
              <p>{discipline.description}</p>
              <div className="card-bottom">
                <span>{discipline.short}</span>
                <span>SELECIONAR +</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="featured section-padding" id="projeto">
        <div className="section-heading">
          <div>
            <div className="eyebrow">02 — PROJETO EM DESTAQUE</div>
            <h2>Da ideia à <span>estrutura.</span></h2>
          </div>
          <p>
            Um sistema não é apenas seu formato final. É o resultado de
            decisões, componentes e relações entre diferentes subsistemas.
          </p>
        </div>

        <div className="featured-panel">
          <div className="featured-info">
            <div className="project-status">
              <span className="status-dot" />
              {selectedDiscipline.status}
            </div>
            <span className="project-category">
              {selectedDiscipline.short} / PROJETO {selectedDiscipline.number}
            </span>
            <h3>{selectedDiscipline.project}</h3>
            <p>{selectedDiscipline.projectDescription}</p>

            <div className="project-details">
              <div>
                <span>FORMATO</span>
                <strong>Exploração interativa</strong>
              </div>
              <div>
                <span>ABORDAGEM</span>
                <strong>Anatomia de sistemas</strong>
              </div>
            </div>

            <a className="button-primary disabled-link" href="#processo">
              Projeto em desenvolvimento <span>↗</span>
            </a>
          </div>

          <div className="featured-visual">
            {selectedId === 'aerospace' ? (
              <div className="satellite-placeholder">
                <div className="satellite-orbit" />
                <div className="satellite-body">
                  <div className="satellite-panel left" />
                  <div className="satellite-panel right" />
                  <div className="satellite-core">
                    <span>EA</span>
                  </div>
                  <div className="satellite-antenna" />
                </div>
                <span className="callout callout-one">01 — ESTRUTURA</span>
                <span className="callout callout-two">02 — PAINÉIS</span>
                <span className="callout callout-three">03 — SISTEMAS</span>
                <span className="satellite-caption">SCHEMATIC / CONCEPT 001</span>
              </div>
            ) : (
              <div className="alternative-visual">
                <span className="alternative-symbol">
                  {selectedDiscipline.symbol}
                </span>
                <span>{selectedDiscipline.short} / CONCEPT STUDY</span>
                <small>VISUALIZAÇÃO A SER DESENVOLVIDA</small>
              </div>
            )}
          </div>
        </div>
        <p className="prototype-note">
          As ilustrações desta versão são conceituais. Os modelos 3D e a
          exploração detalhada dos componentes serão desenvolvidos nas próximas
          etapas.
        </p>
      </section>

      <section className="process section-padding" id="processo">
        <div className="section-heading">
          <div>
            <div className="eyebrow">03 — METODOLOGIA</div>
            <h2>Como a engenharia <span>acontece.</span></h2>
          </div>
          <p>
            Mais do que apresentar objetos prontos, o atlas busca revelar o
            raciocínio e as etapas envolvidas em seu desenvolvimento.
          </p>
        </div>

        <div className="stages">
          {stages.map((stage) => (
            <article className="stage" key={stage.number}>
              <span className="stage-number">{stage.number}</span>
              <div className="stage-line" />
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#inicio">
          <span className="brand-mark">EA</span>
          <span className="brand-name">
            ENGINEERING
            <strong>ATLAS</strong>
          </span>
        </a>
        <p>Uma exploração visual do conhecimento em engenharia.</p>
        <span className="footer-code">UNB / FGA — INTRODUÇÃO À ENGENHARIA</span>
      </footer>
    </main>
  )
}

export default App
