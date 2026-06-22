import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const novels = defineCollection({
  name: 'novels',
  directory: 'content/cerita',
  include: '**/novel.md',
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    genres: z.array(z.string()),
    status: z.enum(['ongoing', 'completed', 'hiatus']),
    cover_color: z.string().default('#c8a44a'),
    updated_at: z.string(),
  }),
  transform: (doc) => {
    const novelSlug = doc._meta.path.split('/')[0]
    return { ...doc, novelSlug }
  },
})

const chapters = defineCollection({
  name: 'chapters',
  directory: 'content/cerita',
  include: '**/bab-*.md',
  schema: z.object({
    title: z.string(),
    chapter_number: z.number(),
    published_at: z.string(),
  }),
  transform: (doc) => {
    const parts = doc._meta.path.split('/')
    const novelSlug = parts[0]
    const babSlug = parts[1]
    return { ...doc, novelSlug, babSlug }
  },
})

export default defineConfig({
  collections: [novels, chapters],
})
