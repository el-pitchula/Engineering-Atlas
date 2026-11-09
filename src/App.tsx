
import './App.css'

const engineeringAreas = [
  {
    id: 'aerospace',
    number: '01',
    name: 'Engenharia Aeroespacial',
    description:
      'Explore sistemas espaciais, aeronaves, satélites, dinâmica orbital e tecnologias de voo.',
    project: 'Anatomia de um satélite',
    icon: '◈',
  },
  {
    id: 'automotive',
    number: '02',
    name: 'Engenharia Automotiva',
    description:
      'Descubra os sistemas mecânicos, estruturas, propulsão e dinâmica dos veículos.',
    project: 'Anatomia de um veículo',
    icon: '⌁',
  },
  {
    id: 'energy',
    number: '03',
    name: 'Engenharia de Energia',
    description:
      'Entenda a geração, conversão, armazenamento e distribuição de energia.',
    project: 'Sistema de conversão energética',
    icon: 'ϟ',
  },
  {
    id: 'electronics',
    number: '04',
    name: 'Engenharia Eletrônica',
    description:
      'Explore circuitos, sensores, sistemas embarcados, instrumentação e automação.',
    project: 'Sistema eletrônico interativo',
    icon: '⌘',
  },
  {
    id: 'software',
    number: '05',
    name: 'Engenharia de Software',
    description:
      'Conheça a arquitetura, organização e construção de sistemas computacionais.',
    project: 'Arquitetura de um sistema',
    icon: '{ }',
  },
]

function App() {
  return (
    <main className="atlas">
      <header className="navbar">
        <a className="brand" href="#">
          <span className="brand-symbol">E.</span>
          <span>ENGINEERING ATLAS</span>
        </a>

        <nav>
          <a href="#explore">Explorar</a>
          <a href="#about">Sobre o projeto</a>
        </nav>

        <span className="institution">UNB / FGA</span>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="eyebrow">
            FACULDADE DO GAMA · UNIVERSIDADE DE BRASÍLIA
          </span>

          <h1>
            Engineering
            <br />
            <span>Atlas.</span>
          </h1>

          <p className="hero-description">
            Um espaço interativo para descobrir como a engenharia transforma
            ideias em sistemas, estruturas e tecnologias reais.
          </p>

          <a className="explore-button" href="#explore">
            EXPLORAR ENGENHARIAS <span>↗</span>
          </a>
        </div>

        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orbit orbit-three" />
          <div className="visual-center">
            <span>ENGINEERING</span>
            <strong>01—05</strong>
            <span>INTERACTIVE ATLAS</span>
          </div>
          <span className="visual-coordinate">15°59' S / 48°02' W</span>
          <span className="visual-caption">SYSTEMS · DESIGN · TECHNOLOGY</span>
        </div>

        <div className="hero-index">
          <span>01 / 05</span>
          <span>FIVE ENGINEERING DISCIPLINES</span>
        </div>
      </section>

      <section className="intro" id="about">
        <span className="section-label">THE PROJECT / 001</span>
        <div>
          <h2>
            Entender engenharia
            <br />
            é entender <span>como as coisas funcionam.</span>
          </h2>
          <p>
            Cada projeto apresenta um sistema de engenharia por meio de
            modelos tridimensionais, componentes interativos e explicações
            sobre as decisões envolvidas em seu desenvolvimento.
          </p>
        </div>
      </section>

      <section className="disciplines" id="explore">
        <div className="section-heading">
          <div>
            <span className="section-label">EXPLORE / 001—005</span>
            <h2>As engenharias da FGA</h2>
          </div>
          <span className="section-count">05 DISCIPLINAS</span>
        </div>

        <div className="engineering-grid">
          {engineeringAreas.map((area) => (
            <article className="engineering-card" key={area.id}>
              <div className="card-top">
                <span>{area.number} / 05</span>
                <span className="card-icon">{area.icon}</span>
              </div>

              <div className="card-content">
                <h3>{area.name}</h3>
                <p>{area.description}</p>
              </div>

              <div className="card-footer">
                <div>
                  <span>PROJETO EM DESTAQUE</span>
                  <strong>{area.project}</strong>
                </div>
                <span className="card-arrow">↗</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>ENGINEERING ATLAS</span>
        <span>UNIVERSIDADE DE BRASÍLIA · FGA</span>
        <span>DESIGN / EXPLORE / UNDERSTAND</span>
      </footer>
    </main>
  )
}

export default App
