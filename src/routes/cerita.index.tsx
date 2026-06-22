import { createFileRoute, Link } from '@tanstack/react-router'
import { allNovels, allChapters } from 'content-collections'

export const Route = createFileRoute('/cerita/')({
  component: CeritaIndex,
})

const STATUS_LABEL: Record<string, string> = {
  ongoing: 'Berlanjut',
  completed: 'Selesai',
  hiatus: 'Hiatus',
}

function CeritaIndex() {
  const novels = allNovels

  return (
    <div>
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Koleksi</p>
          <h1 className="page-title">Cerita yang Tersedia</h1>
          <p className="page-subtitle">
            {novels.length > 0
              ? `${novels.length} judul novel tersedia untuk dibaca.`
              : 'Belum ada cerita yang ditambahkan.'}
          </p>
        </div>
      </div>

      {novels.length === 0 ? (
        <div className="empty">
          <p className="empty-title">Belum ada cerita</p>
          <p className="empty-sub">Tambahkan cerita pertama melalui halaman Upload.</p>
          <Link to="/upload" className="btn btn-outline">Panduan Upload</Link>
        </div>
      ) : (
        <div className="wrap">
          <div className="novels-grid">
            {novels.map((novel) => {
              const chapCount = allChapters.filter(
                (c) => c.novelSlug === novel.novelSlug,
              ).length

              return (
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
                    <h2 className="card-title">{novel.title}</h2>
                    <p className="card-author">oleh {novel.author}</p>
                    <p className="card-desc">{novel.description}</p>
                    <div className="card-foot">
                      <div className="tags">
                        {novel.genres.slice(0, 2).map((g) => (
                          <span key={g} className="tag">{g}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>
                          {chapCount} bab
                        </span>
                        <span className={`badge badge-${novel.status}`}>
                          {STATUS_LABEL[novel.status] ?? novel.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
