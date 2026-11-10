
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
    <main className="engineering-page">
      <header className="engineering-header">
        <Link to="/" className="back-link">
          ← VOLTAR AO ATLAS
        </Link>

        <span className="section-label">
          ENGINEERING ATLAS / {area.number}
        </span>
      </header>

      <section className="engineering-hero">
        <span className="section-label">
          FACULDADE DO GAMA · UNB
        </span>

        <h1>{area.name}</h1>

        <p>{area.description}</p>

        <span className="engineering-index">
          DISCIPLINA {area.number} / 05
        </span>
      </section>

      <section className="engineering-overview">
        <span className="section-label">01 / VISÃO GERAL</span>

        <div>
          <h2>O que essa engenharia estuda?</h2>
          <p>{area.overview}</p>
        </div>
      </section>

      <section className="engineering-fields">
        <span className="section-label">02 / CAMPOS DE ATUAÇÃO</span>

        <h2>Áreas de exploração</h2>

        <div className="fields-grid">
          {area.fields.map((field, index) => (
            <article className="field-card" key={field}>
              <span>0{index + 1}</span>
              <h3>{field}</h3>
              <span className="field-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="featured-project">
        <span className="section-label">03 / PROJETO EM DESTAQUE</span>

        <div className="project-content">
          <div>
            <h2>{area.project}</h2>
            <p>{area.projectDescription}</p>

            {projectRoute ? (
              <>
                <span className="project-status">
                  PROJETO INTERATIVO
                </span>

                <Link
                  to={projectRoute}
                  className="project-explore-link"
                >
                  EXPLORAR PROJETO →
                </Link>
              </>
            ) : (
              <span className="project-status">
                PROJETO EM DESENVOLVIMENTO
              </span>
            )}
          </div>

          <div className="project-visual">
            <span>{area.number}</span>
            <strong>ATLAS</strong>
            <small>INTERACTIVE PROJECT</small>
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
