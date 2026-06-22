import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allNovels, allChapters } from 'content-collections'

export const Route = createFileRoute('/cerita/$novel/')({
  component: NovelIndex,
})

const STATUS_LABEL: Record<string, string> = {
  ongoing: 'Berlanjut',
  completed: 'Selesai',
  hiatus: 'Hiatus',
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function NovelIndex() {
  const { novel: novelSlug } = Route.useParams()

  const novel = allNovels.find((n) => n.novelSlug === novelSlug)
  if (!novel) throw notFound()

  const chapters = allChapters
    .filter((c) => c.novelSlug === novelSlug)
    .sort((a, b) => a.chapter_number - b.chapter_number)

  const initials = novel.title
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  return (
    <div>
      {/* Novel header */}
      <div className="wrap">
        <div className="novel-hd">
          <div style={{ marginBottom: '1.25rem' }}>
            <Link to="/cerita" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              ← Semua Cerita
            </Link>
          </div>
          <div className="novel-hd-inner">
            <div
              className="novel-cover"
              style={{
                background: `linear-gradient(145deg, ${novel.cover_color}, color-mix(in srgb, ${novel.cover_color} 60%, black))`,
              }}
            >
              {initials}
            </div>
            <div className="novel-hd-meta">
              <h1 className="novel-hd-title">{novel.title}</h1>
              <p className="novel-hd-author">oleh {novel.author}</p>
              <p className="novel-hd-desc">{novel.description}</p>
              <div className="novel-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Bab</span>
                  <span className="stat-val">{chapters.length} bab</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Status</span>
                  <span className="stat-val">{STATUS_LABEL[novel.status] ?? novel.status}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Genre</span>
                  <span className="stat-val">{novel.genres.join(', ')}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Diperbarui</span>
                  <span className="stat-val">{formatDate(novel.updated_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter list */}
      <div className="wrap">
        {chapters.length === 0 ? (
          <div className="empty">
            <p className="empty-title">Belum ada bab</p>
            <p className="empty-sub">Bab pertama belum ditambahkan.</p>
          </div>
        ) : (
          <>
            <p className="eyebrow" style={{ marginBottom: '0.25rem' }}>Daftar Bab</p>
            <ul className="chapter-list">
              {chapters.map((ch) => (
                <li key={ch.babSlug} className="chapter-li">
                  <Link
                    to="/cerita/$novel/$bab"
                    params={{ novel: novelSlug, bab: ch.babSlug }}
                    className="chapter-row"
                  >
                    <span className="chapter-row-num">Bab {ch.chapter_number}</span>
                    <span className="chapter-row-title">{ch.title}</span>
                    <span className="chapter-row-date">{formatDate(ch.published_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
