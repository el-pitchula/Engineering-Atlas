import { Link } from 'react-router-dom'
import SoftwareViewer from '../components/3d/SoftwareViewer'
import ProjectGallery from '../components/ProjectGallery'
import './SoftwareProjectPage.css'

const systems = [
  {
    number: '01',
    title: 'Gabinete estrutural',
    description:
      'Estrutura física responsável por proteger os componentes internos e organizar a montagem da unidade de computação.',
    components: ['Chassi', 'Painéis', 'Fixações'],
  },
  {
    number: '02',
    title: 'Placa principal',
    description:
      'Plataforma de interconexão que permite a comunicação entre os componentes e distribui os sinais e a alimentação elétrica.',
    components: ['Circuitos', 'Barramentos', 'Conectores'],
  },
  {
    number: '03',
    title: 'Módulo de processamento',
    description:
      'Unidade responsável pela execução das instruções e pelo processamento das operações do sistema computacional.',
    components: ['Processador', 'Núcleos', 'Unidade lógica'],
  },
  {
    number: '04',
    title: 'Memória e armazenamento',
    description:
      'Subsistema responsável por manter dados e instruções disponíveis durante a execução e armazenar informações de forma persistente.',
    components: ['Memória RAM', 'Armazenamento', 'Controladores'],
  },
]

function SoftwareProjectPage() {
  return (
    <main className="software-project-page">
      <header className="software-project-header">
        <Link to="/engineering/software" className="software-back-link">
          <span aria-hidden="true">←</span>
          <span>Engenharia de Software</span>
        </Link>

        <div className="software-header-label">
          <span>ENGINEERING ATLAS</span>
          <span>SOFTWARE ENGINEERING / 05</span>
        </div>
      </header>

      <section className="software-project-intro">
        <div className="software-project-kicker">
          <span>05 / 05</span>
          <span>COMPUTAÇÃO EMBARCADA</span>
        </div>

        <h1>Arquitetura de um sistema computacional</h1>

        <p className="software-project-description">
          Explore a organização física de uma unidade de computação
          embarcada e compreenda como seus componentes trabalham em conjunto
          para executar, processar e armazenar informações.
        </p>

        <div className="software-project-meta">
          <div>
            <span className="software-meta-label">ÁREA</span>
            <span>Engenharia de Software</span>
          </div>

          <div>
            <span className="software-meta-label">SISTEMA</span>
            <span>Computação embarcada</span>
          </div>

          <div>
            <span className="software-meta-label">EXPERIÊNCIA</span>
            <span>Visualização 3D interativa</span>
          </div>
        </div>
      </section>

      <section className="software-explorer-section">
        <div className="software-section-heading">
          <div>
            <span className="software-section-index">01 / EXPLORAÇÃO</span>
            <h2>Explore a estrutura</h2>
          </div>

          <p>
            Selecione os componentes, observe sua organização e explore a
            montagem em diferentes perspectivas.
          </p>
        </div>

        <SoftwareViewer />
      </section>

      <section className="software-systems-section">
        <div className="software-section-heading">
          <div>
            <span className="software-section-index">02 / COMPONENTES</span>
            <h2>Elementos fundamentais</h2>
          </div>

          <p>
            Conheça os principais elementos físicos que compõem a unidade de
            computação.
          </p>
        </div>

        <div className="software-systems-grid">
          {systems.map((system) => (
            <article className="software-system-item" key={system.number}>
              <span className="software-system-number">
                {system.number}
              </span>

              <div className="software-system-content">
                <h3>{system.title}</h3>
                <p>{system.description}</p>

                <div className="software-system-components">
                  {system.components.map((component) => (
                    <span key={component}>{component}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="software-architecture-section">
        <div className="software-section-heading">
          <div>
            <span className="software-section-index">03 / ARQUITETURA</span>
            <h2>Do hardware ao software</h2>
          </div>

          <p>
            A estrutura física é apenas uma parte do sistema. O software
            define como os recursos computacionais são utilizados.
          </p>
        </div>

        <div className="software-architecture-content">
          <div className="software-architecture-intro">
            <span>CAMADAS DE UM SISTEMA</span>
            <p>
              A arquitetura de software organiza os elementos responsáveis
              pela comunicação entre o hardware, o sistema operacional e as
              aplicações.
            </p>
          </div>

          <div className="software-architecture-layers">
            <div className="software-layer">
              <span>04</span>
              <div>
                <h3>Aplicações</h3>
                <p>
                  Programas e funcionalidades que atendem aos objetivos do
                  sistema.
                </p>
              </div>
              <span className="software-layer-tag">APPLICATION</span>
            </div>

            <div className="software-layer">
              <span>03</span>
              <div>
                <h3>Sistema operacional</h3>
                <p>
                  Gerenciamento de processos, memória, dispositivos e recursos
                  computacionais.
                </p>
              </div>
              <span className="software-layer-tag">OPERATING SYSTEM</span>
            </div>

            <div className="software-layer">
              <span>02</span>
              <div>
                <h3>Drivers e firmware</h3>
                <p>
                  Camada de comunicação e controle entre os recursos físicos
                  e o software.
                </p>
              </div>
              <span className="software-layer-tag">LOW-LEVEL SOFTWARE</span>
            </div>

            <div className="software-layer">
              <span>01</span>
              <div>
                <h3>Hardware</h3>
                <p>
                  Componentes físicos responsáveis pelo processamento,
                  armazenamento e comunicação.
                </p>
              </div>
              <span className="software-layer-tag">PHYSICAL LAYER</span>
            </div>
          </div>
        </div>
      </section>

      <section className="software-gallery-section">
        <div className="software-section-heading">
          <div>
            <span className="software-section-index">04 / DOCUMENTAÇÃO</span>
            <h2>Referências técnicas</h2>
          </div>

          <p>
            Consulte os registros visuais e as representações técnicas do
            projeto.
          </p>
        </div>

        <ProjectGallery projectId="software" />
      </section>

      <footer className="software-project-footer">
        <span>ENGINEERING ATLAS</span>
        <span>ENGENHARIA DE SOFTWARE</span>
        <span>05 / 05</span>
      </footer>
    </main>
  )
}

export default SoftwareProjectPage