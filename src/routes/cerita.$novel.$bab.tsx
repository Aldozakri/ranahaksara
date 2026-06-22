import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allNovels, allChapters } from 'content-collections'
import { marked } from 'marked'

export const Route = createFileRoute('/cerita/$novel/$bab')({
  component: ReadingPage,
})

function ReadingPage() {
  const { novel: novelSlug, bab: babSlug } = Route.useParams()

  const novel = allNovels.find((n) => n.novelSlug === novelSlug)
  if (!novel) throw notFound()

  const chapters = allChapters
    .filter((c) => c.novelSlug === novelSlug)
    .sort((a, b) => a.chapter_number - b.chapter_number)

  const chapterIndex = chapters.findIndex((c) => c.babSlug === babSlug)
  const chapter = chapters[chapterIndex]
  if (!chapter) throw notFound()

  const prev = chapterIndex > 0 ? chapters[chapterIndex - 1] : null
  const next = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null

  const html = marked(chapter.content) as string

  return (
    <div className="reading-pg">
      {/* Top bar */}
      <div className="reading-bar">
        <div className="breadcrumb">
          <Link to="/cerita">Cerita</Link>
          <span className="breadcrumb-sep">›</span>
          <Link to="/cerita/$novel" params={{ novel: novelSlug }}>{novel.title}</Link>
          <span className="breadcrumb-sep">›</span>
          <span style={{ color: 'var(--text)' }}>Bab {chapter.chapter_number}</span>
        </div>
        <span className="reading-progress">
          {chapterIndex + 1} / {chapters.length}
        </span>
      </div>

      {/* Chapter body */}
      <article className="reading-body">
        <p className="ch-label">Bab {chapter.chapter_number}</p>
        <h1 className="ch-title">{chapter.title}</h1>
        <div className="ch-rule" />
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>

      {/* Navigation */}
      <nav className="reading-nav">
        <div className="reading-nav-prev">
          {prev ? (
            <Link
              to="/cerita/$novel/$bab"
              params={{ novel: novelSlug, bab: prev.babSlug }}
              className="btn btn-outline"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Bab Sebelumnya
            </Link>
          ) : (
            <Link
              to="/cerita/$novel"
              params={{ novel: novelSlug }}
              className="btn btn-ghost"
            >
              ← Daftar Bab
            </Link>
          )}
        </div>

        <div className="reading-nav-center">
          <Link to="/cerita/$novel" params={{ novel: novelSlug }} style={{ color: 'var(--text-subtle)', fontSize: '0.75rem' }}>
            {novel.title}
          </Link>
        </div>

        <div className="reading-nav-next">
          {next ? (
            <Link
              to="/cerita/$novel/$bab"
              params={{ novel: novelSlug, bab: next.babSlug }}
              className="btn btn-outline"
            >
              Bab Selanjutnya
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          ) : (
            <Link
              to="/cerita/$novel"
              params={{ novel: novelSlug }}
              className="btn btn-ghost"
            >
              Selesai ✓
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}
