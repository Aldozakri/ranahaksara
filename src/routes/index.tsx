import { createFileRoute, Link } from '@tanstack/react-router'
import { allNovels } from 'content-collections'

export const Route = createFileRoute('/')({
  component: Landing,
})

function Landing() {
  const featured = allNovels.slice(0, 3)

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <p className="hero-ornament anim-1">Karya Tulis Pribadi</p>

        <h1 className="hero-title anim-2">
          Ranah<br />
          <em>Aksara</em>
        </h1>

        <p className="hero-tagline anim-3">Cerita yang menunggu untuk ditemukan</p>

        <p className="hero-desc anim-4">
          Kumpulan novel bersambung yang ditulis dengan perlahan, disimpan dengan hati-hati,
          dan dibagikan untuk siapa saja yang ingin singgah.
        </p>

        <div className="hero-ctas anim-5">
          <Link to="/cerita" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Cerita yang Tersedia
          </Link>
          <Link to="/upload" className="btn btn-outline">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Cerita
          </Link>
        </div>

        <div className="hero-divider" />
      </section>

      {/* Featured novels teaser */}
      {featured.length > 0 && (
        <section style={{ padding: '0 0 5rem' }}>
          <div className="wrap">
            <p className="eyebrow" style={{ marginBottom: '1.5rem' }}>Novel Terbaru</p>
            <div className="novels-grid">
              {featured.map((novel) => (
                <Link
                  key={novel.novelSlug}
                  to="/cerita/$novel"
                  params={{ novel: novel.novelSlug }}
                  className="novel-card"
                >
                  <div
                    className="card-band"
                    style={{ background: novel.cover_color }}
                  />
                  <div className="card-body">
                    <h3 className="card-title">{novel.title}</h3>
                    <p className="card-author">oleh {novel.author}</p>
                    <p className="card-desc">{novel.description}</p>
                    <div className="card-foot">
                      <div className="tags">
                        {novel.genres.slice(0, 2).map((g) => (
                          <span key={g} className="tag">{g}</span>
                        ))}
                      </div>
                      <span className={`badge badge-${novel.status}`}>
                        {novel.status === 'ongoing' ? 'Berlanjut' : novel.status === 'completed' ? 'Selesai' : 'Hiatus'}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
