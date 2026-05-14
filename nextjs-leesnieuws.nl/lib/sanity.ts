import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '6idcxy5u',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2026-05-13',
  perspective: 'published',
})