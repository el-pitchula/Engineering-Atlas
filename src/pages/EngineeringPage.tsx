
import { Link, useParams } from 'react-router-dom'
import { engineeringAreas } from '../data/engineeringAreas'
import './EngineeringPage.css'

function EngineeringPage() {
  const { id } = useParams()

  const area = engineeringAreas.find(
    (engineering) => engineering.id === id
  )

  if (!area) {
    return (
      <main className="engineering-page">
        <Link to="/" className="back-link">
          ← Voltar ao Atlas
        </Link>
        <h1>Engenharia não encontrada</h1>
      </main>
    )
  }

  const projectRoutes: Record<string, string> = {
    aerospace: '/engineering/aerospace/satellite',
    automotive: '/engineering/automotive/brakes',
  }

  const projectRoute = projectRoutes[area.id]

  return (
    <main
      className={`engineering-page engineering-${area.id}`}
      data-engineering={area.id}
    >
      <header className="engineering-header">
        <Link to="/" className="back-link">
          ← VOLTAR AO ATLAS
        </Link>

        <span className="section-label">
          ENGINEERING ATLAS / {area.number}
        </span>
      </header>

      <section className="engineering-hero">
        <div className="engineering-hero-content">
          <span className="section-label">
            FACULDADE DO GAMA · UNB
          </span>

          <h1>{area.name}</h1>

          <p>{area.description}</p>
        </div>

        <div className="engineering-hero-index">
          <span>DISCIPLINA</span>
          <strong>{area.number}</strong>
          <span>05 / ENGINEERING AREAS</span>
        </div>

        <span className="engineering-reference">
          RESEARCH ATLAS / {area.id.toUpperCase()}
        </span>
      </section>

      <section className="engineering-overview">
        <div className="engineering-section-heading">
          <span className="section-label">
            01 / VISÃO GERAL
          </span>
          <span className="section-reference">
            INTRODUCTION
          </span>
        </div>

        <div className="overview-content">
          <h2>O que essa engenharia estuda?</h2>
          <p>{area.overview}</p>
        </div>
      </section>

      <section className="engineering-fields">
        <div className="engineering-section-heading">
          <span className="section-label">
            02 / CAMPOS DE ATUAÇÃO
          </span>
          <span className="section-reference">
            AREAS OF STUDY
          </span>
        </div>

        <h2>Áreas de exploração</h2>

        <div className="fields-grid">
          {area.fields.map((field, index) => (
            <article className="field-card" key={field}>
              <span className="field-number">
                0{index + 1}
              </span>

              <h3>{field}</h3>

              <span className="field-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-project">
        <div className="engineering-section-heading">
          <span className="section-label">
            03 / PROJETO EM DESTAQUE
          </span>
          <span className="section-reference">
            FEATURED PROJECT
          </span>
        </div>

        <div className="project-content">
          <div className="project-information">
            <span className="project-kicker">
              ENGINEERING PROJECT / {area.number}
            </span>

            <h2>{area.project}</h2>

            <p>{area.projectDescription}</p>

            {projectRoute ? (
              <div className="project-access">
                <span className="project-status">
                  <span className="status-indicator" />
                  PROJETO INTERATIVO DISPONÍVEL
                </span>

                <Link
                  to={projectRoute}
                  className="project-explore-link"
                  aria-label={`Explorar projeto 3D: ${area.project}`}
                >
                  <span className="project-link-content">
                    <strong>EXPLORAR MODELO 3D</strong>
                    <small>
                      Visualização interativa e análise dos componentes
                    </small>
                  </span>

                  <span className="project-link-arrow">↗</span>
                </Link>
              </div>
            ) : (
              <span className="project-status">
                <span className="status-indicator status-pending" />
                PROJETO EM DESENVOLVIMENTO
              </span>
            )}
          </div>

          <div className="project-visual">
            <span className="project-visual-number">
              {area.number}
            </span>

            <strong>ATLAS</strong>

            <small>INTERACTIVE PROJECT</small>

            <span className="project-visual-coordinate">
              FGA / UNB
            </span>
          </div>
        </div>
      </section>

      <footer className="engineering-footer">
        <Link to="/">ENGINEERING ATLAS</Link>
        <span>UNIVERSIDADE DE BRASÍLIA · FGA</span>
      </footer>
    </main>
  )
}

export default EngineeringPage
