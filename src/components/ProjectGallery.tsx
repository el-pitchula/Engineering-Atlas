import './ProjectGallery.css'
interface ProjectGalleryProps {
  projectId: string
}

const stages = [
  {
    number: '01',
    title: 'Esboço conceitual',
    description: 'Estudo inicial da forma e organização do projeto.',
    file: '01-esboco.png',
  },
  {
    number: '02',
    title: 'Concept art',
    description: 'Representação visual e identidade do projeto.',
    file: '02-concept.png',
  },
  {
    number: '03',
    title: 'Desenho técnico',
    description: 'Vistas, dimensões e identificação dos componentes.',
    file: '03-tecnico.png',
  },
  {
    number: '04',
    title: 'Render final',
    description: 'Representação final do objeto em perspectiva.',
    file: '04-render.png',
  },
]

export default function ProjectGallery({
  projectId,
}: ProjectGalleryProps) {
  return (
    <section className="project-gallery">
      <div className="project-gallery-heading">
        <span className="project-gallery-label">
          DOCUMENTAÇÃO VISUAL
        </span>

        <h2>Do conceito à representação final</h2>

        <p>
          Acompanhe as etapas de concepção, desenvolvimento
          e representação do projeto.
        </p>
      </div>

      <div className="project-gallery-grid">
        {stages.map((stage) => (
          <article
            className="project-gallery-card"
            key={stage.number}
          >
            <div className="project-gallery-image">
              <span>{stage.number}</span>
              <small>IMAGEM EM PREPARAÇÃO</small>
            </div>

            <div className="project-gallery-info">
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <small>{stage.file}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
