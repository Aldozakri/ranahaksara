import type { Config } from '@netlify/functions'

export default async (req: Request) => {
  const json = (body: object, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })

  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  let slug: string | undefined
  let secret: string | undefined
  try {
    const body = await req.json()
    slug = body.slug
    secret = body.secret
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }

  const adminSecret = Netlify.env.get('ADMIN_SECRET')
  if (!adminSecret || secret !== adminSecret) {
    return json({ error: 'Kata sandi salah' }, 401)
  }

  if (!slug || typeof slug !== 'string' || !/^[a-z0-9-]+$/.test(slug)) {
    return json({ error: 'Slug tidak valid' }, 400)
  }

  const token = Netlify.env.get('GITHUB_TOKEN')
  const owner = Netlify.env.get('GITHUB_OWNER')
  const repo = Netlify.env.get('GITHUB_REPO')
  const branch = Netlify.env.get('GITHUB_BRANCH') || 'main'

  if (!token || !owner || !repo) {
    return json({ error: 'Konfigurasi GitHub belum disetel. Set env vars GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO.' }, 500)
  }

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents`
  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }

  const folderPath = `content/cerita/${slug}`
  const listRes = await fetch(`${apiBase}/${folderPath}?ref=${branch}`, { headers: ghHeaders })

  if (!listRes.ok) {
    if (listRes.status === 404) return json({ error: 'Novel tidak ditemukan di repositori' }, 404)
    return json({ error: 'Gagal mengakses GitHub API' }, 500)
  }

  const files: Array<{ path: string; sha: string; type: string }> = await listRes.json()
  if (!Array.isArray(files)) return json({ error: 'Respons GitHub tidak dikenal' }, 500)

  for (const file of files) {
    if (file.type !== 'file') continue
    const delRes = await fetch(`${apiBase}/${file.path}`, {
      method: 'DELETE',
      headers: ghHeaders,
      body: JSON.stringify({ message: `chore: hapus novel "${slug}"`, sha: file.sha, branch }),
    })
    if (!delRes.ok) {
      return json({ error: `Gagal menghapus file: ${file.path}` }, 500)
    }
  }

  return Response.json({ success: true })
}

export const config: Config = {
  path: '/api/delete-cerita',
  method: 'POST',
}
