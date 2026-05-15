import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: '6idcxy5u',
  dataset: 'production',
  apiVersion: '2026-05-13',
  useCdn: false,
  perspective: 'published',
})