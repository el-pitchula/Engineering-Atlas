
import { useState, useEffect } from 'react'
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
  const [availableImages, setAvailableImages] = useState<string[]>([])
  const [activeImage, setActiveImage] = useState<number | null>(null)

  const imagePath = (file: string) =>
    `/projects/${projectId}/${file}`

  function closeLightbox() {
    setActiveImage(null)
  }

  function showNext() {
    if (activeImage === null) return

    setActiveImage((activeImage + 1) % availableImages.length)
  }

  function showPrevious() {
    if (activeImage === null) return

    setActiveImage(
      (activeImage - 1 + availableImages.length) %
        availableImages.length
    )
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (activeImage === null) return

      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowRight') showNext()
      if (event.key === 'ArrowLeft') showPrevious()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeImage, availableImages.length])

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
        {stages.map((stage, index) => (
          <article
            className="project-gallery-card"
            key={stage.number}
          >
            <div className="project-gallery-image">
              {availableImages.includes(stage.file) ? (
                <button
                  className="project-gallery-open"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ampliar ${stage.title}`}
                >
                  <img
                    src={imagePath(stage.file)}
                    alt={stage.title}
                  />
                  <span>AMPLIAR IMAGEM</span>
                </button>
              ) : (
                <ImagePlaceholder
                  projectId={projectId}
                  file={stage.file}
                  number={stage.number}
                  onAvailable={() =>
                    setAvailableImages((current) =>
                      current.includes(stage.file)
                        ? current
                        : [...current, stage.file]
                    )
                  }
                />
              )}
            </div>

            <div className="project-gallery-info">
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
              <small>{stage.file}</small>
            </div>
          </article>
        ))}
      </div>

      {activeImage !== null && (
        <div
          className="project-lightbox"
          onClick={closeLightbox}
        >
          <button
            className="project-lightbox-close"
            onClick={closeLightbox}
            aria-label="Fechar imagem"
          >
            ×
          </button>

          <button
            className="project-lightbox-previous"
            onClick={(event) => {
              event.stopPropagation()
              showPrevious()
            }}
            aria-label="Imagem anterior"
          >
            ‹
          </button>

          <div
            className="project-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={imagePath(stages[activeImage].file)}
              alt={stages[activeImage].title}
            />

            <div className="project-lightbox-caption">
              <span>
                {stages[activeImage].number} —{' '}
                {stages[activeImage].title}
              </span>

              <small>
                {activeImage + 1} / {stages.length}
              </small>
            </div>
          </div>

          <button
            className="project-lightbox-next"
            onClick={(event) => {
              event.stopPropagation()
              showNext()
            }}
            aria-label="Próxima imagem"
          >
            ›
          </button>
        </div>
      )}
    </section>
  )
}

interface ImagePlaceholderProps {
  projectId: string
  file: string
  number: string
  onAvailable: () => void
}

function ImagePlaceholder({
  projectId,
  file,
  number,
  onAvailable,
}: ImagePlaceholderProps) {
  const [unavailable, setUnavailable] = useState(false)

  if (unavailable) {
    return (
      <>
        <span>{number}</span>
        <small>IMAGEM EM PREPARAÇÃO</small>
      </>
    )
  }

  return (
    <img
      src={`/projects/${projectId}/${file}`}
      alt=""
      style={{ display: 'none' }}
      onLoad={onAvailable}
      onError={() => setUnavailable(true)}
    />
  )
}
