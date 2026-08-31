import { social, galleryPhotos } from '../../data/seed'
import './Gallery.css'

function Gallery() {
  return (
    <section className="section gallery">
      <div className="container">
        <div className="section-head gallery__head">
          <span className="eyebrow">No dia a dia da casa</span>
          <h2>O melhor do Tarumã está na mesa</h2>
          <p>
            Fotos do salão, dos pratos e dos drinks saem primeiro no Instagram —
            acompanhe {social.instagramHandle} para ver o dia a dia das duas unidades.
          </p>
          <a className="btn btn-outline gallery__ig-link" href={social.instagram} target="_blank" rel="noreferrer">
            Seguir no Instagram
          </a>
        </div>

        <div className="gallery__grid">
          {galleryPhotos.map((photo, i) => (
            <div className={`gallery__item gallery__item--${i}`} key={photo.src}>
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Gallery
