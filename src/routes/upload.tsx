import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { allNovels } from 'content-collections'

export const Route = createFileRoute('/upload')({
  component: UploadPage,
})

type DeleteState = {
  activeSlug: string | null
  secret: string
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
}

function UploadPage() {
  const [form, setForm] = useState({
    novelSlug: '',
    babNumber: '',
    babTitle: '',
    publishedAt: new Date().toISOString().split('T')[0],
    content: '',
  })
  const [output, setOutput] = useState('')
  const [del, setDel] = useState<DeleteState>({
    activeSlug: null,
    secret: '',
    status: 'idle',
    message: '',
  })

  function openDelete(slug: string) {
    setDel({ activeSlug: slug, secret: '', status: 'idle', message: '' })
  }

  function closeDelete() {
    setDel((d) => ({ ...d, activeSlug: null, status: 'idle', message: '' }))
  }

  async function confirmDelete(slug: string) {
    if (!del.secret) return
    setDel((d) => ({ ...d, status: 'loading', message: '' }))
    try {
      const res = await fetch('/api/delete-cerita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, secret: del.secret }),
      })
      const data = await res.json()
      if (res.ok) {
        setDel({ activeSlug: null, secret: '', status: 'success', message: `Cerita "${slug}" berhasil dihapus. Netlify akan rebuild otomatis dalam 1–2 menit.` })
      } else {
        setDel((d) => ({ ...d, status: 'error', message: data.error || 'Terjadi kesalahan.' }))
      }
    } catch {
      setDel((d) => ({ ...d, status: 'error', message: 'Gagal menghubungi server.' }))
    }
  }

  function generate() {
    if (!form.babNumber || !form.babTitle) return
    const frontmatter = `---\ntitle: "${form.babTitle}"\nchapter_number: ${form.babNumber}\npublished_at: "${form.publishedAt}"\n---\n\n${form.content || '(Isi cerita di sini...)'}`
    setOutput(frontmatter)
  }

  function copyOutput() {
    if (!output) return
    navigator.clipboard.writeText(output).catch(() => {})
  }

  return (
    <div className="upload-pg">
      <div className="wrap-narrow">
        <div className="section-head">
          <p className="eyebrow">Panduan</p>
          <h1 className="page-title">Upload Cerita</h1>
          <p className="page-subtitle">
            Karena situs ini berjalan di Netlify sebagai static site, menambah cerita
            dilakukan dengan menambah file ke repositori GitHub.
          </p>
        </div>

        <h2>Cara Kerja</h2>
        <p>
          Setiap novel dan babnya disimpan sebagai file Markdown (
          <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>.md</code>) di folder{' '}
          <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>content/cerita/</code>.
          Setiap kali kamu push ke GitHub, Netlify akan membangun ulang situs secara otomatis.
        </p>

        <h2>Struktur Folder</h2>
        <div className="code-blk">{`content/
└── cerita/
    ├── judul-novel-1/
    │   ├── novel.md        ← metadata novel
    │   ├── bab-1.md
    │   ├── bab-2.md
    │   └── bab-3.md
    └── judul-novel-2/
        ├── novel.md
        └── bab-1.md`}</div>

        <h2>Template: novel.md</h2>
        <p>Buat file ini di dalam folder novel baru:</p>
        <div className="code-blk">{`---
title: "Judul Novel Kamu"
author: "Nama Penulis"
description: "Deskripsi singkat novel, 1-3 kalimat."
genres:
  - Fantasi
  - Romansa
status: ongoing        # ongoing | completed | hiatus
cover_color: "#c8a44a" # warna aksen kartu novel (hex)
updated_at: "2026-06-22"
---`}</div>

        <h2>Template: bab-N.md</h2>
        <p>
          Nama file <strong>harus</strong> dimulai dengan <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>bab-</code>,
          contoh: <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>bab-1.md</code>,{' '}
          <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>bab-2.md</code>, dst.
        </p>
        <div className="code-blk">{`---
title: "Judul Bab"
chapter_number: 1
published_at: "2026-06-22"
---

Paragraf pertama cerita dimulai di sini. Tidak perlu
indentasi—CSS akan menanganinya secara otomatis.

Paragraf selanjutnya dipisahkan oleh baris kosong.

## Sub-judul

Kamu bisa menggunakan heading, **teks tebal**, *miring*,
dan > blockquote untuk variasi teks.`}</div>

        <h2>Langkah Upload</h2>
        <ul>
          <li>Buat folder baru di <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>content/cerita/nama-novel/</code></li>
          <li>Tambahkan file <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>novel.md</code> dengan metadata novel</li>
          <li>Tambahkan file <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>bab-1.md</code>, <code style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>bab-2.md</code>, dst. untuk setiap bab</li>
          <li>Commit dan push ke branch utama di GitHub</li>
          <li>Netlify akan membangun dan men-deploy otomatis dalam 1–2 menit</li>
        </ul>

        {/* Generator form */}
        <h2>Generator Frontmatter Bab</h2>
        <p>
          Isi form di bawah untuk menghasilkan teks frontmatter yang siap di-copy
          ke file bab baru.
        </p>

        <div className="gen-form">
          <h3>Buat Bab Baru</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div className="form-row" style={{ gridColumn: '1 / -1' }}>
              <label>Judul Bab</label>
              <input
                type="text"
                placeholder="Contoh: Fajar yang Retak"
                value={form.babTitle}
                onChange={(e) => setForm({ ...form, babTitle: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label>Nomor Bab</label>
              <input
                type="number"
                min={1}
                placeholder="1"
                value={form.babNumber}
                onChange={(e) => setForm({ ...form, babNumber: e.target.value })}
              />
            </div>
            <div className="form-row">
              <label>Tanggal Rilis</label>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              />
            </div>
            <div className="form-row" style={{ gridColumn: '1 / -1' }}>
              <label>Pratinjau Isi (opsional)</label>
              <textarea
                placeholder="Tuliskan beberapa paragraf awal cerita..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={generate}>
              Generate
            </button>
            {output && (
              <button className="btn btn-outline" onClick={copyOutput}>
                Copy ke Clipboard
              </button>
            )}
          </div>

          {output && (
            <div>
              <p className="gen-output-label" style={{ marginTop: '1.25rem' }}>Output — simpan sebagai bab-{form.babNumber || 'N'}.md</p>
              <div className="gen-output">{output}</div>
            </div>
          )}
        </div>

        {/* Manage / Delete section */}
        <h2>Kelola Cerita</h2>
        <p>
          Hapus novel beserta seluruh babnya dari repositori. Tindakan ini tidak dapat dibatalkan — Netlify
          akan otomatis rebuild setelah file dihapus.
        </p>

        {del.status === 'success' && (
          <div className="delete-msg delete-msg-ok">{del.message}</div>
        )}

        {allNovels.length === 0 ? (
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.88rem' }}>Belum ada cerita.</p>
        ) : (
          <ul className="manage-list">
            {allNovels.map((novel) => {
              const isActive = del.activeSlug === novel.novelSlug
              return (
                <li key={novel.novelSlug} className="manage-row">
                  <div className="manage-row-main">
                    <div
                      style={{
                        width: '0.35rem',
                        height: '2.25rem',
                        borderRadius: '2px',
                        background: novel.cover_color,
                        flexShrink: 0,
                      }}
                    />
                    <div className="manage-row-info">
                      <p className="manage-row-title">{novel.title}</p>
                      <p className="manage-row-meta">{novel.author} · {novel.novelSlug}</p>
                    </div>
                    {isActive ? (
                      <button className="btn btn-ghost" style={{ fontSize: '0.72rem' }} onClick={closeDelete}>
                        Batal
                      </button>
                    ) : (
                      <button className="btn btn-danger" style={{ fontSize: '0.72rem' }} onClick={() => openDelete(novel.novelSlug)}>
                        Hapus
                      </button>
                    )}
                  </div>

                  {isActive && (
                    <div className="delete-confirm">
                      <div className="delete-confirm-field">
                        <p className="delete-confirm-label">Kata sandi admin</p>
                        <div className="form-row" style={{ marginBottom: 0 }}>
                          <input
                            type="password"
                            placeholder="Masukkan kata sandi..."
                            value={del.secret}
                            onChange={(e) => setDel((d) => ({ ...d, secret: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && confirmDelete(novel.novelSlug)}
                            autoFocus
                          />
                        </div>
                      </div>
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.72rem' }}
                        disabled={!del.secret || del.status === 'loading'}
                        onClick={() => confirmDelete(novel.novelSlug)}
                      >
                        {del.status === 'loading' ? 'Menghapus...' : 'Hapus Sekarang'}
                      </button>
                      {del.status === 'error' && (
                        <div className="delete-msg delete-msg-err" style={{ width: '100%' }}>
                          {del.message}
                        </div>
                      )}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
